from courses.models import Course, OptionsList, StudentOptionChoice
from .models import Degree, Domain, Student


def reset_data():
  students = Student.objects.all()
  options_lists = OptionsList.objects.all()
  courses = Course.objects.all()
  
  for course in courses:
    course.students.clear()
    course.save()
  
  for options_list in options_lists:
    options_list.students.clear()
    options_list.save()
  
  for student in students:
    student.courses.clear()
    student.options_lists.clear()
    
    for options_list in options_lists:
      if student.current_year == (options_list.year - 1):
        student.options_lists.add(options_list)
        options_list.students.add(student)
        options_list.save()
    student.save()

  StudentOptionChoice.objects.all().delete()