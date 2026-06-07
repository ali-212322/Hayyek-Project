import base64
import requests

from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from core.responses import success_response, created_response, error_response
from orders.models import Order
from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer


class PaymentCreateView(APIView):
    """POST /api/v1/payments/ — Mock/system payment"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return error_response(
                "VALIDATION_ERROR",
                "Invalid data.",
                details=serializer.errors,
            )

        payment = serializer.save()

        payment.status = "paid"
        payment.transaction_id = f"TXN-{payment.id}-MOCK"
        payment.save(update_fields=["status", "transaction_id"])

        payment.order.status = "accepted"
        payment.order.save(update_fields=["status"])

        return created_response(
            data=PaymentSerializer(payment).data,
            message="Payment processed successfully.",
        )


class MoyasarPaymentVerifyView(APIView):
    """POST /api/v1/payments/verify-moyasar/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order")
        payment_id = request.data.get("payment_id")

        if not order_id or not payment_id:
            return error_response(
                "VALIDATION_ERROR",
                "order and payment_id are required.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order = Order.objects.get(id=order_id, resident=request.user)
        except Order.DoesNotExist:
            return error_response(
                "NOT_FOUND",
                "Order not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        moyasar_api_key = getattr(settings, "MOYASAR_SECRET_KEY", None)

        if not moyasar_api_key:
            return error_response(
                "MOYASAR_NOT_CONFIGURED",
                "Moyasar API key is not configured.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        auth_token = base64.b64encode(f"{moyasar_api_key}:".encode()).decode()

        try:
            moyasar_response = requests.get(
                f"https://api.moyasar.com/v1/payments/{payment_id}",
                headers={
                    "Authorization": f"Basic {auth_token}",
                    "Content-Type": "application/json",
                },
                timeout=15,
            )
        except requests.RequestException:
            return error_response(
                "MOYASAR_CONNECTION_ERROR",
                "Could not connect to Moyasar.",
                status_code=status.HTTP_502_BAD_GATEWAY,
            )

        if moyasar_response.status_code != 200:
            return error_response(
                "MOYASAR_VERIFICATION_FAILED",
                "Could not verify payment with Moyasar.",
                details=moyasar_response.json()
                if moyasar_response.headers.get("content-type", "").startswith("application/json")
                else moyasar_response.text,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        moyasar_payment = moyasar_response.json()

        moyasar_status = moyasar_payment.get("status")
        moyasar_amount = moyasar_payment.get("amount")
        moyasar_currency = moyasar_payment.get("currency")

        expected_amount = int(order.total_price * 100)

        if moyasar_status != "paid":
            return error_response(
                "PAYMENT_NOT_PAID",
                "Payment is not paid.",
                details={"status": moyasar_status},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if moyasar_currency != "SAR":
            return error_response(
                "INVALID_CURRENCY",
                "Invalid payment currency.",
                details={"currency": moyasar_currency},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if moyasar_amount != expected_amount:
            return error_response(
                "AMOUNT_MISMATCH",
                "Payment amount does not match order total.",
                details={
                    "expected_amount": expected_amount,
                    "moyasar_amount": moyasar_amount,
                },
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        payment, created = Payment.objects.update_or_create(
            order=order,
            defaults={
                "amount": order.total_price,
                "status": "paid",
                "method": "visa",
                "transaction_id": payment_id,
            },
        )

        order.status = "accepted"
        order.save(update_fields=["status"])

        response_serializer = PaymentSerializer(payment)

        return success_response(
            data=response_serializer.data,
            message="Moyasar payment verified successfully.",
        )


class PaymentDetailView(APIView):
    """GET /api/v1/payments/<id>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk, order__resident=request.user)
        except Payment.DoesNotExist:
            return error_response(
                "NOT_FOUND",
                "Payment not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        serializer = PaymentSerializer(payment)
        return success_response(data=serializer.data)


class PaymentWebhookView(APIView):
    """POST /api/v1/payments/webhook/ — Moyasar webhook"""
    permission_classes = []

    def post(self, request):
        transaction_id = request.data.get("id")
        new_status = request.data.get("status")

        try:
            payment = Payment.objects.get(transaction_id=transaction_id)
            payment.status = new_status
            payment.save(update_fields=["status"])
        except Payment.DoesNotExist:
            pass

        return success_response(message="Webhook received.")