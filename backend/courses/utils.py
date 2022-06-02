from users.models import Degree, Domain, Role, Student, User
from courses.models import OptionsList, StudentOptionChoice, StudentCourse
from collections import deque

def get_max_years(domain, degree):
    if domain == Domain.CTI and degree == Degree.BACHELOR:
        return 4
    if domain in [Domain.INFO, Domain.MATE]:
        if degree == Degree.BACHELOR:
            return 3
        return 2
    return 0
    
    

def students_courses_assignment():
    options_lists = OptionsList.objects.all()
    for options_list in options_lists:
        courses = list(options_list.courses.all())
        students = OptionsList.objects.get_students_sorted_by_grade(options_list)
        queues = {
            course.id: [deque(), course.capacity] for course in courses
        }
        for student in students:
            choices = StudentOptionChoice.objects.choices_sorted_by_order(student=student, options_list=options_list)
            for choice in choices:
                if queues[choice.course.id][1] > 0:
                    queues[choice.course.id][1] -= 1
                    queues[choice.course.id][0].append(student)
                    break
        for course in courses:
            print(course.title)
            print(queues[course.id][0])

    

  