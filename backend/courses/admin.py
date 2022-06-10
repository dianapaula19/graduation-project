from django.contrib import admin
from .models import Course, OptionsList, StudentOptionChoice

# Register your models here.
admin.site.register(Course)
admin.site.register(OptionsList)
admin.site.register(StudentOptionChoice)