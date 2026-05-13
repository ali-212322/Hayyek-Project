from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from core.responses import success_response
from core.permissions import IsAdmin
from accounts.models import CustomUser
from providers.models import ProviderProfile
from orders.models import Order


class AdminProviderListView(APIView):
    """GET /api/v1/admin/providers/"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        status_filter = request.query_params.get("status", "pending")
        providers = ProviderProfile.objects.filter(status=status_filter)
        data = [
            {
                "id": p.id,
                "business_name": p.business_name,
                "phone": p.user.phone,
                "full_name": p.user.full_name,
                "status": p.status,
                "created_at": p.created_at,
            }
            for p in providers
        ]
        return success_response(data=data)


class AdminUserListView(APIView):
    """GET /api/v1/admin/users/"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users = CustomUser.objects.all().order_by("-created_at")
        data = [
            {
                "id": u.id,
                "phone": u.phone,
                "full_name": u.full_name,
                "role": u.role,
                "is_suspended": u.is_suspended,
                "created_at": u.created_at,
            }
            for u in users
        ]
        return success_response(data=data)


class AdminStatsView(APIView):
    """GET /api/v1/admin/stats/"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        data = {
            "total_users": CustomUser.objects.count(),
            "total_providers": ProviderProfile.objects.filter(status="approved").count(),
            "pending_providers": ProviderProfile.objects.filter(status="pending").count(),
            "total_orders": Order.objects.count(),
            "completed_orders": Order.objects.filter(status="completed").count(),
        }
        return success_response(data=data)