from rest_framework import serializers
from .models import ProviderProfile


class ProviderProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="user.phone", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = ProviderProfile
        fields = [
            "id", "phone", "full_name", "business_name", "description",
            "neighborhood", "latitude", "longitude", "logo",
            "status", "is_available", "avg_rating", "total_orders", "created_at",
        ]
        read_only_fields = ["id", "status", "avg_rating", "total_orders", "created_at"]


class ProviderRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile
        fields = ["business_name", "description", "neighborhood", "latitude", "longitude"]

    def create(self, validated_data):
        user = self.context["request"].user
        return ProviderProfile.objects.create(user=user, **validated_data)


class ProviderListSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="user.phone", read_only=True)

    class Meta:
        model = ProviderProfile
        fields = [
            "id", "phone", "business_name", "description",
            "neighborhood", "is_available", "avg_rating", "total_orders", "logo",
        ]