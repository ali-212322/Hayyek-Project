from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from core.responses import success_response, created_response, error_response
from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer


class PaymentCreateView(APIView):
    """POST /api/v1/payments/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("VALIDATION_ERROR", "Invalid data.", details=serializer.errors)

        payment = serializer.save()

        # TODO: Integrate Moyasar payment gateway here
        # For now, simulate successful payment
        payment.status = "paid"
        payment.transaction_id = f"TXN-{payment.id}-MOCK"
        payment.save(update_fields=["status", "transaction_id"])

        # Update order status
        payment.order.status = "accepted"
        payment.order.save(update_fields=["status"])

        return created_response(
            data=PaymentSerializer(payment).data,
            message="Payment processed successfully.",
        )


class PaymentDetailView(APIView):
    """GET /api/v1/payments/<id>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk, order__resident=request.user)
        except Payment.DoesNotExist:
            return error_response("NOT_FOUND", "Payment not found.", status_code=status.HTTP_404_NOT_FOUND)

        serializer = PaymentSerializer(payment)
        return success_response(data=serializer.data)


class PaymentWebhookView(APIView):
    """POST /api/v1/payments/webhook/ — Moyasar webhook"""
    permission_classes = []

    def post(self, request):
        # TODO: Verify Moyasar webhook signature
        # Update payment status based on webhook data
        transaction_id = request.data.get("id")
        new_status = request.data.get("status")

        try:
            payment = Payment.objects.get(transaction_id=transaction_id)
            payment.status = new_status
            payment.save(update_fields=["status"])
        except Payment.DoesNotExist:
            pass

        return success_response(message="Webhook received.")