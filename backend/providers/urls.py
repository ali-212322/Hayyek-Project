from django.urls import path
from .views import (
    ProviderRegisterView,
    ProviderListView,
    ProviderDetailView,
    ProviderProfileView,
    ProviderApprovalView,
)

urlpatterns = [
    path("", ProviderListView.as_view(), name="provider-list"),
    path("register/", ProviderRegisterView.as_view(), name="provider-register"),
    path("me/", ProviderProfileView.as_view(), name="provider-me"),
    path("<int:pk>/", ProviderDetailView.as_view(), name="provider-detail"),
    path("<int:pk>/approve/", ProviderApprovalView.as_view(), name="provider-approve"),
]