import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from users.models import AppSetting

class SettingsConsumer(WebsocketConsumer):
  def connect(self):
    self.group_name = 'users' 
    
    async_to_sync(self.channel_layer.group_add) (
      self.group_name,
      self.channel_name
    )

    self.accept()
  
  def receive(self, text_data):
    text_data_json = json.loads(text_data)
    status = text_data_json['status']
    if status == 'SUCCESS':
      value = AppSetting.objects.all().filter(key='SELECTION_SESSION_OPEN')[0].value
      async_to_sync(self.channel_layer.group_send)(
        self.group_name,
        {
          'type': 'set_selection_session_open',
          'SELECTION_SESSION_OPEN': value
        }
      )  

  def set_selection_session_open(self, event):
    SELECTION_SESSION_OPEN = event['SELECTION_SESSION_OPEN']
    self.send(text_data=json.dumps({
      'type': 'set_selection_session_open',
      'SELECTION_SESSION_OPEN': SELECTION_SESSION_OPEN
    }))
