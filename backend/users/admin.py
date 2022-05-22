from django.contrib import admin
from .models import User, Student, Teacher, Grade, Category

# Register your models here.
admin.site.register(User)
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(Grade)
admin.site.register(Category)