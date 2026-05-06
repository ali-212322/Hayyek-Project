import logging
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.responses import success_response, created_response, error_response
from .models import OTPVerification
from .serializers import (
    RegisterSerializer,
    OTPVerifySerializer,
    HayyakTokenObtainPairSerializer,
    UserProfileSerializer,
)

logger = logging.getLogger(__name__)
User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Registration failed.",
                details=serializer.errors,
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        user = serializer.save()
        otp = OTPVerification.create_for_user(user=user, purpose="register")
        logger.info("OTP for %s: %s", user.phone, otp.otp_code)
        return created_response(
            data={"phone": user.phone},
            message="Registration successful. Please verify your phone.",
        )


class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("VALIDATION_ERROR", "Invalid data.", details=serializer.errors)

        phone = serializer.validated_data["phone"]
        otp_code = serializer.validated_data["otp_code"]

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return error_response("USER_NOT_FOUND", "User not found.", status_code=status.HTTP_404_NOT_FOUND)

        otp = (
            OTPVerification.objects.filter(user=user, purpose="register", is_used=False)
            .order_by("-created_at")
            .first()
        )

        if not otp:
            return error_response("OTP_NOT_FOUND", "No pending OTP. Please request a new one.")

        success, message = otp.verify(otp_code)
        if not success:
            return error_response("OTP_INVALID", message)

        user.is_phone_verified = True
        user.save(update_fields=["is_phone_verified"])

        return success_response(message="Phone verified successfully.")


class LoginView(TokenObtainPairView):
    serializer_class = HayyakTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            return success_response(data=response.data, message="Login successful.")
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return error_response("MISSING_TOKEN", "Refresh token is required.")
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return error_response("INVALID_TOKEN", "Token is invalid or already blacklisted.")
        return success_response(message="Logged out successfully.")


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return success_response(data=serializer.data)
