from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from core.responses import success_response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    """GET /api/v1/notifications/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return success_response(data=serializer.data)


class NotificationMarkReadView(APIView):
    """PUT /api/v1/notifications/<id>/read/"""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            notification.is_read = True
            notification.save(update_fields=["is_read"])
        except Notification.DoesNotExist:
            pass
        return success_response(message="Notification marked as read.")


class NotificationMarkAllReadView(APIView):
    """PUT /api/v1/notifications/read-all/"""
    permission_classes = [IsAuthenticated]

    def put(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return success_response(message="All notifications marked as read.")