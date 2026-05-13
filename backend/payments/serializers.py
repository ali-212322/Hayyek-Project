from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source="order.order_number", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id", "order", "order_number", "amount",
            "status", "method", "transaction_id", "created_at",
        ]
        read_only_fields = ["id", "status", "transaction_id", "created_at"]


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["order", "method"]

    def create(self, validated_data):
        order = validated_data["order"]
        return Payment.objects.create(
            amount=order.total_price,
            **validated_data
        )