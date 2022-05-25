from django.contrib import admin
from .models import Course, OptionsList, StudentCourse, StudentOptionChoice

# Register your models here.
admin.site.register(Course)
admin.site.register(OptionsList)
admin.site.register(StudentOptionChoice)
admin.site.register(StudentCourse)