from django.urls import path
from .views import (
    OrderCreateView,
    OrderListView,
    OrderDetailView,
    OrderStatusUpdateView,
    OrderCancelView,
)

urlpatterns = [
    path("", OrderListView.as_view(), name="order-list"),
    path("create/", OrderCreateView.as_view(), name="order-create"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("<int:pk>/status/", OrderStatusUpdateView.as_view(), name="order-status"),
    path("<int:pk>/cancel/", OrderCancelView.as_view(), name="order-cancel"),
]