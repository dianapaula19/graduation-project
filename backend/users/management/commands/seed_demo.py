"""Fill an empty database with fictional demo data.

    python manage.py migrate
    python manage.py seed_demo

Creates an admin, two teachers, six students with grades, four elective
courses and one options list. Every account uses the password given with
--password (default: demo1234).
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from courses.models import Course, OptionsList
from users.models import (Degree, Domain, Grade, LearningMode, Role, Student, StudyProgram,
                          Teacher, User)
from users.utils import get_selection_session_setting

TEACHERS = [("Ada", "Lovelace"), ("Alan", "Turing")]
STUDENTS = [("Maria", "Popescu", 9.8), ("Andrei", "Ionescu", 9.4), ("Elena", "Georgescu", 9.1),
            ("Mihai", "Stan", 8.7), ("Ioana", "Dumitru", 8.2), ("Radu", "Marin", 7.9)]
COURSES = [("Natural Language Processing", 0), ("Computer Vision", 1),
           ("Distributed Systems", 0), ("Cryptography", 1)]


class Command(BaseCommand):
  help = "Create fictional demo accounts, courses and an options list"

  def add_arguments(self, parser):
    parser.add_argument("--password", default="demo1234")

  @transaction.atomic
  def handle(self, *args, password, **options):
    if User.objects.exists():
      self.stderr.write("The database already has users; seed_demo only runs on an empty database.")
      return

    def user(email, first, last, role):
      return User.objects.create_user(email=email, password=password, first_name=first, last_name=last,
                                      role=role, verified=True, changed_password=True)

    user("admin@demo.example", "Demo", "Admin", Role.ADMIN)
    teachers = [Teacher.objects.create(user=user(f"{last.lower()}@demo.example", first, last, Role.TEACHER))
                for first, last in TEACHERS]

    students = []
    for first, last, grade in STUDENTS:
      student = Student.objects.create(
        user=user(f"{first.lower()}.{last.lower()}@demo.example", first, last, Role.STUDENT),
        domain=Domain.INFO, learning_mode=LearningMode.IF, degree=Degree.BACHELOR,
        study_program=StudyProgram.INFO, current_group="231", current_year=2)
      Grade.objects.create(student=student, grade=grade, year=2)
      students.append(student)

    courses = [Course.objects.create(title=title, teacher=teachers[t], capacity=3, degree=Degree.BACHELOR,
                                     semester=1, link="https://example.com/syllabus")
               for title, t in COURSES]

    options_list = OptionsList.objects.create(
      title="Year 3 electives (semester 1)", domain=Domain.INFO, learning_mode=LearningMode.IF,
      degree=Degree.BACHELOR, study_program=StudyProgram.INFO, year=3, semester=1)
    options_list.courses.set(courses)
    options_list.students.set(students)
    for student in students:
      student.options_lists.add(options_list)

    get_selection_session_setting()
    self.stdout.write(self.style.SUCCESS(
      f"Demo data created. Log in as admin@demo.example, lovelace@demo.example or "
      f"maria.popescu@demo.example with password {password!r}."))
