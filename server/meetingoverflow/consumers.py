from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

from . import models


class AgendaConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'mof'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.load(text_data)
        content = text_data_json['content']
        id = text_data_json['id']

        agenda = models.Agenda.objects.get(id=id)
        agenda.content = content
        agenda.save()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'add_agenda',
                'content': content,
                'id': id
            }
        )

        def add_note(self, event):
            content = event['content']
            id = event['id']
            self.send(text_data=json.dumps({
                'content': content,
                'id': id
            }))
