from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    resident_name = serializers.CharField(source="resident.full_name", read_only=True)
    provider_name = serializers.CharField(source="provider.business_name", read_only=True)
    service_name = serializers.CharField(source="service.name", read_only=True)
    payment_status = serializers.CharField(source="payment.status", read_only=True, default=None)

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "resident", "resident_name",
            "provider", "provider_name", "service", "service_name",
            "status", "payment_status", "notes", "address", "latitude", "longitude",
            "scheduled_at", "total_price", "created_at",
        ]
        read_only_fields = ["id", "order_number", "resident", "status", "payment_status", "created_at"]


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["provider", "service", "notes", "address", "latitude", "longitude", "scheduled_at"]

    def create(self, validated_data):
        resident = self.context["request"].user
        service = validated_data.get("service")
        total_price = service.price if service else 0
        return Order.objects.create(
            resident=resident,
            total_price=total_price,
            **validated_data
        )


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]