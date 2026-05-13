from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    resident_name = serializers.CharField(source="resident.full_name", read_only=True)
    provider_name = serializers.CharField(source="provider.business_name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id", "resident", "resident_name", "provider", "provider_name",
            "order", "rating", "comment", "provider_reply", "created_at",
        ]
        read_only_fields = ["id", "resident", "created_at"]


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["order", "provider", "rating", "comment"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def create(self, validated_data):
        resident = self.context["request"].user
        return Review.objects.create(resident=resident, **validated_data)