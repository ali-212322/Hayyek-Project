from rest_framework import serializers
from .models import ServiceCategory, Service


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ["id", "name_ar", "name_en", "icon", "is_active"]


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name_en", read_only=True)
    provider_name = serializers.CharField(source="provider.business_name", read_only=True)
    provider_latitude = serializers.DecimalField(
        source="provider.latitude",
        max_digits=9,
        decimal_places=6,
        read_only=True,
    )
    provider_longitude = serializers.DecimalField(
        source="provider.longitude",
        max_digits=9,
        decimal_places=6,
        read_only=True,
    )

    class Meta:
        model = Service
        fields = [
            "id",
            "provider",
            "provider_name",
            "provider_latitude",
            "provider_longitude",
            "category",
            "category_name",
            "name",
            "description",
            "image_url",
            "price",
            "duration_minutes",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "provider", "created_at"]


class ServiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "category",
            "name",
            "description",
            "image_url",
            "price",
            "duration_minutes",
        ]

    def create(self, validated_data):
        provider = self.context["request"].user.provider_profile
        return Service.objects.create(provider=provider, **validated_data)