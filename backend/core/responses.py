from rest_framework.response import Response
from rest_framework import status


def success_response(data=None, message="", status_code=status.HTTP_200_OK):
    return Response(
        {
            "success": True,
            "data": data if data is not None else {},
            "message": message,
        },
        status=status_code,
    )


def created_response(data=None, message="Created successfully."):
    return success_response(data=data, message=message, status_code=status.HTTP_201_CREATED)


def error_response(code, message, status_code=status.HTTP_400_BAD_REQUEST, details=None):
    payload = {
        "success": False,
        "error": {
            "code": code,
            "message": message,
        },
    }
    if details:
        payload["error"]["details"] = details
    return Response(payload, status=status_code)