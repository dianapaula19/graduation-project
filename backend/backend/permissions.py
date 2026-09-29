from rest_framework import permissions
from rest_framework.authtoken.models import Token
from users.models import Role


def get_token_user(request):
    """Return the user of the request's ``Authorization: Token <key>`` header, or None.

    A missing header, a malformed header or an unknown token all mean "not
    logged in" instead of raising (which Django turned into a 500 error).
    """
    header = request.META.get('HTTP_AUTHORIZATION', '')
    key = header.split(' ', 1)[1].strip() if ' ' in header else ''
    if not key:
        return None
    token = Token.objects.select_related('user').filter(key=key).first()
    return token.user if token else None


class IsTokenAuthentificated(permissions.BasePermission):
    message = 'You are not logged in'

    def has_permission(self, request, view):
        return get_token_user(request) is not None


class HasRole(permissions.BasePermission):
    role = None

    def has_permission(self, request, view):
        user = get_token_user(request)
        return user is not None and user.role == self.role


class IsStudent(HasRole):
    message = 'Not a student'
    role = Role.STUDENT


class IsTeacher(HasRole):
    message = 'Not a teacher'
    role = Role.TEACHER


class IsAdmin(HasRole):
    message = 'Not an admin'
    role = Role.ADMIN
