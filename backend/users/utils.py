from courses.models import Course, OptionsList, StudentOptionChoice
from .models import Degree, Domain, Student

def get_max_years(domain: Domain, degree: Degree) -> int:
  if degree == Degree.BACHELOR:
    if domain == Domain.CTI:
      return 4
    return 3
  return 2


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
      
    student.save()

  StudentOptionChoice.objects.all().delete()