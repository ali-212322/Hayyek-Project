from django.urls import path
from .admin_views import (
    AdminProviderListView,
    AdminUserListView,
    AdminStatsView,
)

urlpatterns = [
    path("providers/", AdminProviderListView.as_view(), name="admin-providers"),
    path("users/", AdminUserListView.as_view(), name="admin-users"),
    path("stats/", AdminStatsView.as_view(), name="admin-stats"),
]