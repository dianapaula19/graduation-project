from email import message
from rest_framework import permissions
from rest_framework.authtoken.models import Token
from users.models import Role, User

class IsTokenAuthentificated(permissions.BasePermission):
    message = 'You are not logged in'

    def has_permission(self, request, view):
        key = request.META.get('HTTP_AUTHORIZATION')[7:]
        try:
            token = Token.objects.get(key=key)
            if token:
                return True
        except:
            return False
        return False

class IsStudent(permissions.BasePermission):
    message = 'Not a student'

    def has_permission(self, request, view):
        key = request.META.get('HTTP_AUTHORIZATION')[7:]
        token = Token.objects.get(key=key)
        if token:
            user = User.objects.get(email=token.user)
            if user:
                return user.role == Role.STUDENT
            return False
        return False

class IsTeacher(permissions.BasePermission):
    message = 'Not a teacher'

    def has_permission(self, request, view):
        key = request.META.get('HTTP_AUTHORIZATION')[7:]
        token = Token.objects.get(key=key)
        if token:
            user = User.objects.get(email=token.user)
            if user:
                return user.role == Role.TEACHER
            return False
        return False

class IsAdmin(permissions.BasePermission):
    message = 'Not an admin'

    def has_permission(self, request, view):
        key = request.META.get('HTTP_AUTHORIZATION')[7:]
        token = Token.objects.get(key=key)
        if token:
            user = User.objects.get(email=token.user)
            if user:
                return user.role == Role.ADMIN
            return False
        return False