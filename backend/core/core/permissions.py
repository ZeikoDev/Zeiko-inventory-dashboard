from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """Permite el acceso solo a usuarios autenticados con rol admin."""

    message = 'Only administrators can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'admin'
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """Lectura para cualquier usuario autenticado; escritura solo para admin."""

    message = 'Only administrators can modify this resource.'

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(request.user, 'role', None) == 'admin'
