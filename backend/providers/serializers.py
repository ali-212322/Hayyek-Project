from rest_framework import serializers
from .models import ProviderProfile

class ProviderProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="user.phone", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    neighborhood = serializers.SerializerMethodField()

    def get_neighborhood(self, obj):
        if obj.neighborhood:
            return obj.neighborhood.name_ar or obj.neighborhood.name_en or str(obj.neighborhood.id)
        return ""

    class Meta:
        model = ProviderProfile
        fields = [
            "id", "phone", "full_name", "business_name", "description",
            "neighborhood", "latitude", "longitude", "logo",
            "status", "is_available", "avg_rating", "total_orders", "created_at",
        ]
        read_only_fields = ["id", "status", "avg_rating", "total_orders", "created_at"]

    def update(self, instance, validated_data):
        neighborhood_name = self.initial_data.get("neighborhood", "")
        if neighborhood_name:
            from core.models import Neighborhood
            n, _ = Neighborhood.objects.get_or_create(
                name_ar=neighborhood_name,
                defaults={"name_en": neighborhood_name, "is_active": True}
            )
            instance.neighborhood = n
        for attr, value in validated_data.items():
            if attr != "neighborhood":
                setattr(instance, attr, value)
        instance.save()
        return instance

class ProviderRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile
        fields = ["business_name", "description", "latitude", "longitude"]

    def create(self, validated_data):
        user = self.context["request"].user
        return ProviderProfile.objects.create(user=user, **validated_data)

class ProviderListSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="user.phone", read_only=True)
    neighborhood = serializers.SerializerMethodField()

    def get_neighborhood(self, obj):
        if obj.neighborhood:
            return obj.neighborhood.name_ar or obj.neighborhood.name_en or ""
        return ""

    class Meta:
        model = ProviderProfile
        fields = [
            "id", "phone", "business_name", "description",
            "neighborhood", "is_available", "avg_rating", "total_orders", "logo",
        ]