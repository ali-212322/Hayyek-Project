from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

from core.responses import success_response, created_response, error_response
from core.permissions import IsResident
from core.utils import calculate_distance_km
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer, OrderStatusUpdateSerializer


class OrderCreateView(APIView):
    """POST /api/v1/orders/"""
    permission_classes = [IsAuthenticated, IsResident]

    def post(self, request):
        serializer = OrderCreateSerializer(
            data=request.data, context={"request": request}
        )

        if not serializer.is_valid():
            return error_response(
                "VALIDATION_ERROR",
                "Invalid data.",
                details=serializer.errors,
            )

        service = serializer.validated_data.get("service")

        if service and service.provider:
            provider = service.provider

            order_latitude = serializer.validated_data.get("latitude")
            order_longitude = serializer.validated_data.get("longitude")

            if (
                provider.latitude
                and provider.longitude
                and order_latitude
                and order_longitude
            ):
                distance = calculate_distance_km(
                    order_latitude,
                    order_longitude,
                    provider.latitude,
                    provider.longitude,
                )

                if distance > settings.MAX_SERVICE_DISTANCE_KM:
                    return error_response(
                        "PROVIDER_TOO_FAR",
                        f"This provider is more than {settings.MAX_SERVICE_DISTANCE_KM} km away.",
                    )

        order = serializer.save()
        return created_response(
            data=OrderSerializer(order).data,
            message="Order created successfully.",
        )


class OrderListView(APIView):
    """GET /api/v1/orders/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == "resident":
            orders = Order.objects.filter(resident=user)
        elif user.role == "provider":
            orders = Order.objects.filter(provider__user=user)
        else:
            orders = Order.objects.all()

        serializer = OrderSerializer(orders, many=True)
        return success_response(data=serializer.data)


class OrderDetailView(APIView):
    """GET /api/v1/orders/<id>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = request.user
            if user.role == "resident":
                order = Order.objects.get(pk=pk, resident=user)
            elif user.role == "provider":
                order = Order.objects.get(pk=pk, provider__user=user)
            else:
                order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return error_response("NOT_FOUND", "Order not found.", status_code=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return success_response(data=serializer.data)


class OrderStatusUpdateView(APIView):
    """PUT /api/v1/orders/<id>/status/"""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            user = request.user
            if user.role == "provider":
                order = Order.objects.get(pk=pk, provider__user=user)
            elif user.role == "resident":
                order = Order.objects.get(pk=pk, resident=user)
            else:
                order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return error_response("NOT_FOUND", "Order not found.", status_code=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")

        valid_transitions = {
            "provider": ["accepted", "rejected", "in_progress", "completed"],
            "resident": ["cancelled"],
            "admin": ["accepted", "rejected", "in_progress", "completed", "cancelled"],
        }

        if new_status not in valid_transitions.get(user.role, []):
            return error_response("INVALID_STATUS", f"Cannot set status to {new_status}.")

        order.status = new_status
        order.save(update_fields=["status"])

        return success_response(
            data=OrderSerializer(order).data,
            message=f"Order {new_status} successfully.",
        )


class OrderCancelView(APIView):
    """PUT /api/v1/orders/<id>/cancel/"""
    permission_classes = [IsAuthenticated, IsResident]

    def put(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, resident=request.user)
        except Order.DoesNotExist:
            return error_response("NOT_FOUND", "Order not found.", status_code=status.HTTP_404_NOT_FOUND)

        if order.status != "pending":
            return error_response("CANNOT_CANCEL", "Only pending orders can be cancelled.")

        order.status = "cancelled"
        order.save(update_fields=["status"])
        return success_response(message="Order cancelled successfully.")