from django.urls import path
from .views import (
    RegisterView,
    OTPVerifyView,
    LoginView,
    LogoutView,
    MeView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("otp/verify/", OTPVerifyView.as_view(), name="auth-otp-verify"),
    path("token/", LoginView.as_view(), name="auth-token-obtain"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
]
