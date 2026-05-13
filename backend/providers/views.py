from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from core.responses import success_response, created_response, error_response
from core.permissions import IsAdmin, IsProvider
from .models import ProviderProfile
from .serializers import (
    ProviderProfileSerializer,
    ProviderRegisterSerializer,
    ProviderListSerializer,
)


class ProviderRegisterView(APIView):
    """POST /api/v1/providers/register/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if hasattr(request.user, "provider_profile"):
            return error_response("ALREADY_REGISTERED", "Already registered as a provider.")

        serializer = ProviderRegisterSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return error_response("VALIDATION_ERROR", "Invalid data.", details=serializer.errors)

        provider = serializer.save()
        request.user.role = "provider"
        request.user.save(update_fields=["role"])

        return created_response(
            data=ProviderProfileSerializer(provider).data,
            message="Provider registered. Awaiting approval.",
        )


class ProviderListView(APIView):
    """GET /api/v1/providers/"""
    permission_classes = [AllowAny]

    def get(self, request):
        providers = ProviderProfile.objects.filter(status="approved", is_available=True)
        serializer = ProviderListSerializer(providers, many=True)
        return success_response(data=serializer.data)


class ProviderDetailView(APIView):
    """GET /api/v1/providers/<id>/"""
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            provider = ProviderProfile.objects.get(pk=pk, status="approved")
        except ProviderProfile.DoesNotExist:
            return error_response("NOT_FOUND", "Provider not found.", status_code=status.HTTP_404_NOT_FOUND)

        serializer = ProviderProfileSerializer(provider)
        return success_response(data=serializer.data)


class ProviderProfileView(APIView):
    """GET + PUT /api/v1/providers/me/"""
    permission_classes = [IsAuthenticated, IsProvider]

    def get(self, request):
        try:
            provider = request.user.provider_profile
        except ProviderProfile.DoesNotExist:
            return error_response("NOT_FOUND", "Provider profile not found.", status_code=status.HTTP_404_NOT_FOUND)
        serializer = ProviderProfileSerializer(provider)
        return success_response(data=serializer.data)

    def put(self, request):
        try:
            provider = request.user.provider_profile
        except ProviderProfile.DoesNotExist:
            return error_response("NOT_FOUND", "Provider profile not found.", status_code=status.HTTP_404_NOT_FOUND)

        serializer = ProviderProfileSerializer(provider, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response("VALIDATION_ERROR", "Invalid data.", details=serializer.errors)
        serializer.save()
        return success_response(data=serializer.data, message="Profile updated.")


class ProviderApprovalView(APIView):
    """PUT /api/v1/providers/<id>/approve/ — Admin only"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def put(self, request, pk):
        try:
            provider = ProviderProfile.objects.get(pk=pk)
        except ProviderProfile.DoesNotExist:
            return error_response("NOT_FOUND", "Provider not found.", status_code=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if new_status not in ["approved", "rejected", "suspended"]:
            return error_response("INVALID_STATUS", "Status must be approved, rejected, or suspended.")

        provider.status = new_status
        provider.save(update_fields=["status"])
        return success_response(message=f"Provider {new_status} successfully.")