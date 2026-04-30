from rest_framework.permissions import BasePermission


class IsResident(BasePermission):
    message = "This action is restricted to residents."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "resident"
        )


class IsProvider(BasePermission):
    message = "This action is restricted to service providers."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "provider"
        )


class IsAdmin(BasePermission):
    message = "This action is restricted to administrators."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == "admin" or request.user.is_staff)
        )


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin" or request.user.is_staff:
            return True
        return getattr(obj, "user", None) == request.user