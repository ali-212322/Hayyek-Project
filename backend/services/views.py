from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from core.responses import success_response, created_response, error_response
from core.permissions import IsProvider
from .models import ServiceCategory, Service
from .serializers import (
    ServiceCategorySerializer,
    ServiceSerializer,
    ServiceCreateSerializer,
)


class ServiceCategoryListView(APIView):
    """GET /api/v1/categories/"""
    permission_classes = [AllowAny]

    def get(self, request):
        categories = ServiceCategory.objects.filter(is_active=True)
        serializer = ServiceCategorySerializer(categories, many=True)
        return success_response(data=serializer.data)


class ServiceListView(APIView):
    """GET /api/v1/services/"""
    permission_classes = [AllowAny]

    def get(self, request):
        services = Service.objects.filter(is_active=True)

        category_id = request.query_params.get("category")
        provider_id = request.query_params.get("provider")

        if category_id:
            services = services.filter(category_id=category_id)
        if provider_id:
            services = services.filter(provider_id=provider_id)

        serializer = ServiceSerializer(services, many=True)
        return success_response(data=serializer.data)


class ServiceCreateView(APIView):
    """POST /api/v1/services/"""
    permission_classes = [IsAuthenticated, IsProvider]

    def post(self, request):
        if not hasattr(request.user, "provider_profile"):
            return error_response("NOT_PROVIDER", "You are not registered as a provider.")

        serializer = ServiceCreateSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return error_response("VALIDATION_ERROR", "Invalid data.", details=serializer.errors)

        service = serializer.save()
        return created_response(
            data=ServiceSerializer(service).data,
            message="Service created successfully.",
        )


class ServiceDetailView(APIView):
    """GET / PUT / DELETE /api/v1/services/<id>/"""
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            service = Service.objects.get(pk=pk, is_active=True)
        except Service.DoesNotExist:
            return error_response("NOT_FOUND", "Service not found.", status_code=status.HTTP_404_NOT_FOUND)
        serializer = ServiceSerializer(service)
        return success_response(data=serializer.data)

    def put(self, request, pk):
        try:
            service = Service.objects.get(pk=pk, provider__user=request.user)
        except Service.DoesNotExist:
            return error_response("NOT_FOUND", "Service not found.", status_code=status.HTTP_404_NOT_FOUND)

        serializer = ServiceSerializer(service, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response("VALIDATION_ERROR", "Invalid data.", details=serializer.errors)
        serializer.save()
        return success_response(data=serializer.data, message="Service updated.")

    def delete(self, request, pk):
        try:
            service = Service.objects.get(pk=pk, provider__user=request.user)
        except Service.DoesNotExist:
            return error_response("NOT_FOUND", "Service not found.", status_code=status.HTTP_404_NOT_FOUND)

        service.is_active = False
        service.save(update_fields=["is_active"])
        return success_response(message="Service deleted.")