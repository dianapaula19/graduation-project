from courses.models import Course, OptionsList, StudentOptionChoice
from collections import deque  

def students_courses_assignment():
  options_lists = OptionsList.objects.all()
  for options_list in options_lists:
    courses = list(options_list.courses.all())
    students = OptionsList.objects.get_students_sorted_by_grade(options_list)
    
    no_choice_students = []
    
    queues = {
      course.id: [deque(), course.capacity] for course in courses
    }
    
    current_choice = 0
    assigned_students = []
    
    while len(no_choice_students) + len(assigned_students) != len(students):
      for student in students:
        if student in assigned_students or student in no_choice_students:
          continue
        
        choices = StudentOptionChoice.objects.choices_sorted_by_order(student=student, options_list=options_list)

        if len(choices) == 0:
          no_choice_students.append(student)
          continue
        
        if queues[choices[current_choice].course.id][1] > 0:
          queues[choices[current_choice].course.id][1] -= 1
          queues[choices[current_choice].course.id][0].append(student)
          assigned_students.append(student)
          continue
      
      current_choice += 1
    
    for student in no_choice_students:
      for course in courses:
        if queues[course.id][1] > 0:
          queues[course.id][1] -= 1
          queues[course.id][0].append(student)
          break 

    for course in courses:
      students = queues[course.id][0]

      for student in students:
        student.courses.add(course)
        course.students.add(student)
        student.save()
      
      course.save()

  

  