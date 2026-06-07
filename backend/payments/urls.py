from django.urls import path
from .views import (
    PaymentCreateView,
    PaymentDetailView,
    PaymentWebhookView,
    MoyasarPaymentVerifyView,
)

urlpatterns = [
    path("", PaymentCreateView.as_view(), name="payment-create"),
    path("verify-moyasar/", MoyasarPaymentVerifyView.as_view(), name="payment-verify-moyasar"),
    path("<int:pk>/", PaymentDetailView.as_view(), name="payment-detail"),
    path("webhook/", PaymentWebhookView.as_view(), name="payment-webhook"),
]