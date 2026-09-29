from django.test import TestCase

from users.models import Grade, Role, Student, User
from .models import Course, OptionsList, StudentOptionChoice
from .utils import students_courses_assignment


class AssignmentTests(TestCase):
  def setUp(self):
    self.options_list = OptionsList.objects.create(title='Electives', year=3, semester=1)
    self.a, self.b, self.c = (Course.objects.create(title=t, capacity=1) for t in 'ABC')
    self.options_list.courses.set([self.a, self.b, self.c])

  def student(self, name, grade, ranking):
    user = User.objects.create_user(email=f'{name}@example.com', password='x', role=Role.STUDENT)
    student = Student.objects.create(user=user, current_year=3)
    Grade.objects.create(student=student, grade=grade, year=3)
    self.options_list.students.add(student)
    for order, course in enumerate(ranking):
      StudentOptionChoice.objects.create(student=student, options_list=self.options_list,
                                         course=course, order=order)
    return student

  def courses_of(self, student):
    return [c.title for c in student.courses.all()]

  def test_higher_grades_get_their_first_choice(self):
    best = self.student('best', 9.5, [self.a, self.b, self.c])
    second = self.student('second', 9.0, [self.a, self.b, self.c])
    third = self.student('third', 8.0, [self.c, self.a, self.b])
    students_courses_assignment()
    self.assertEqual(self.courses_of(best), ['A'])
    self.assertEqual(self.courses_of(second), ['B'])
    self.assertEqual(self.courses_of(third), ['C'])

  def test_student_whose_choices_are_all_full_gets_a_free_seat(self):
    # 'late' only ranked A and B; both fill up before their turn. This used to raise IndexError.
    self.student('first', 9.5, [self.a])
    self.student('second', 9.0, [self.b])
    late = self.student('late', 8.0, [self.a, self.b])
    no_choice = self.student('none', 7.0, [])
    students_courses_assignment()
    self.assertEqual(self.courses_of(late), ['C'])
    self.assertEqual(self.courses_of(no_choice), [])  # no seats left
