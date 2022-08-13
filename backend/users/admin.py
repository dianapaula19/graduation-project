from django.contrib import admin
from .models import AppSetting, Category, User, Student, Teacher, Grade

# Register your models here.
admin.site.register(Category)
admin.site.register(User)
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(Grade)
admin.site.register(AppSetting)