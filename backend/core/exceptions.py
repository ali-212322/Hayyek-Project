from rest_framework.views import exception_handler
from rest_framework.exceptions import (
    AuthenticationFailed, NotAuthenticated, PermissionDenied,
    ValidationError, NotFound, Throttled,
)
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return None

    code_map = {
        NotAuthenticated: "NOT_AUTHENTICATED",
        AuthenticationFailed: "AUTHENTICATION_FAILED",
        PermissionDenied: "PERMISSION_DENIED",
        NotFound: "NOT_FOUND",
        Throttled: "RATE_LIMITED",
        ValidationError: "VALIDATION_ERROR",
    }

    code = "ERROR"
    for exc_cls, exc_code in code_map.items():
        if isinstance(exc, exc_cls):
            code = exc_code
            break

    detail = response.data
    if isinstance(detail, dict):
        message = str(detail.get("detail", str(detail)))
        details = {k: v for k, v in detail.items() if k != "detail"} or None
    elif isinstance(detail, list):
        message = " ".join(str(d) for d in detail)
        details = None
    else:
        message = str(detail)
        details = None

    response.data = {
        "success": False,
        "error": {
            "code": code,
            "message": message,
        },
    }
    if details:
        response.data["error"]["details"] = details

    return response


class HayyakException(Exception):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "HAYYAK_ERROR"
    default_message = "An error occurred."

    def __init__(self, message=None, code=None):
        self.message = message or self.default_message
        self.code = code or self.default_code

    def __str__(self):
        return self.message


class OTPExpiredException(HayyakException):
    default_code = "OTP_EXPIRED"
    default_message = "OTP has expired. Please request a new one."


class OTPInvalidException(HayyakException):
    default_code = "OTP_INVALID"
    default_message = "Invalid OTP."