from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from .models import AppSetting, Role, User


class LoginTests(TestCase):
  def setUp(self):
    self.client = APIClient()
    self.admin = User.objects.create_user(
      email='admin@example.com', password='secret', role=Role.ADMIN,
      verified=True, changed_password=True
    )

  def login(self, email, password):
    return self.client.post('/api/user/login', {'email': email, 'password': password}, format='json')

  def test_login_on_a_fresh_database(self):
    # No SELECTION_SESSION_OPEN row exists yet; login used to crash with IndexError.
    self.assertFalse(AppSetting.objects.exists())
    response = self.login('admin@example.com', 'secret')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.data['code'], 'SUCCESS')
    self.assertEqual(response.data['selection_session_open'], 'FALSE')
    self.assertTrue(Token.objects.filter(key=response.data['token']).exists())

  def test_login_errors(self):
    self.assertEqual(self.login('admin@example.com', '').data['code'], 'NO_PASSWORD_OR_EMAIL_PROVIDED')
    self.assertEqual(self.login('admin@example.com', 'wrong').data['code'], 'INVALID_CREDENTIALS')
    User.objects.create_user(email='new@example.com', password='x', verified=False, changed_password=True)
    self.assertEqual(self.login('new@example.com', 'x').data['code'], 'ACCOUNT_NOT_VERIFIED')


class PermissionTests(TestCase):
  def setUp(self):
    self.client = APIClient()
    admin = User.objects.create_user(email='admin@example.com', password='x', role=Role.ADMIN,
                                     verified=True, changed_password=True)
    student = User.objects.create_user(email='student@example.com', password='x', role=Role.STUDENT,
                                       verified=True, changed_password=True)
    self.admin_token = Token.objects.create(user=admin).key
    self.student_token = Token.objects.create(user=student).key

  def get_students(self, header=None):
    if header is None:
      self.client.credentials()  # no Authorization header at all
    else:
      self.client.credentials(HTTP_AUTHORIZATION=header)
    return self.client.get('/api/user/admin/students')

  def test_admin_endpoint(self):
    self.assertEqual(self.get_students(f'Bearer {self.admin_token}').status_code, 200)
    # Each of these used to raise inside the permission check (500).
    self.assertIn(self.get_students().status_code, (401, 403))
    self.assertIn(self.get_students('Bearer not-a-token').status_code, (401, 403))
    self.assertIn(self.get_students('garbage').status_code, (401, 403))
    self.assertIn(self.get_students(f'Bearer {self.student_token}').status_code, (401, 403))

  def test_open_selection_session_creates_setting(self):
    self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
    response = self.client.post('/api/user/admin/update_selection_session_open',
                                {'value': 'TRUE'}, format='json')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(AppSetting.objects.get(key='SELECTION_SESSION_OPEN').value, 'TRUE')
