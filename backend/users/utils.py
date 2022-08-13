from courses.models import Course, OptionsList, StudentOptionChoice
from .models import Student, Domain, Degree, LearningMode, StudyProgram

def get_max_years(domain, degree):
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
      if student.domain == options_list.domain and \
        student.learning_mode == options_list.learning_mode and \
        student.study_program == options_list.study_program and \
        student.degree == options_list.degree and \
        student.current_year == (options_list.year - 1):
        student.options_lists.add(options_list)
        options_list.students.add(student)
        options_list.save()
    
    student.save()

  StudentOptionChoice.objects.all().delete()

def get_students_lists_fun():
  courses = Course.objects.all()
  domains = Domain.choices
  degrees = Degree.choices
  learning_modes = LearningMode.choices
  study_programs = StudyProgram.choices
  lists = []

  for course in courses:
    enrolled_students = course.students.all()
    for domain in domains:
      for degree in degrees:
        max_years = get_max_years(domain[0], degree[0])
        for learning_mode in learning_modes:
          for study_program in study_programs:
            for year in range(1, max_years + 1):
              students = []
              for student in enrolled_students:
                if student.domain == domain[0] and \
                  student.learning_mode == learning_mode[0] and \
                  student.study_program == study_program[0] and \
                  student.degree == degree[0] and \
                  student.current_year == year:
                    students.append({
                      'first_name': student.user.first_name,
                      'last_name': student.user.last_name,
                      'current_group': student.current_group
                    })
              if len(students) > 0:
                list = {
                  'course': course.title,
                  'domain': domain[0],
                  'degree': degree[0],
                  'learning_mode': learning_mode[0],
                  'study_program': study_program[0],
                  'year': year,
                  'students': students
                }
                lists.append(list)
  
  return lists






