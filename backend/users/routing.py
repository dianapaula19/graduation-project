from django.urls import re_path
from . import consumers

websocker_urlpatterns = [
  re_path('ws/socket-server', consumers.SettingsConsumer.as_asgi())
]