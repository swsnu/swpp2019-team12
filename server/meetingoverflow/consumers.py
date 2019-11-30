from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .serializers import AgendaSerializer
from .models import Agenda
import json


class AgendaConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = "note_" + str(
            self.scope["url_route"]["kwargs"]["note_id"]
        )

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        block_data_json = json.loads(text_data)
        content = block_data_json["content"]
        layer_x = block_data_json["layer_x"]
        layer_y = block_data_json["layer_y"]
        n_id = block_data_json["n_id"]

        data = {
            "content": content,
            "layer_x": layer_x,
            "layer_y": layer_y,
            "note": n_id,
            "is_parent_note": True,
        }
        serializer = AgendaSerializer(data=data)
        if serializer.is_valid():
            agenda = serializer.save()
            agenda.has_agenda_block = True
            agenda.save()

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "add_agenda",
                "id": agenda.id,
                "content": content,
                "layer_x": layer_x,
                "layer_y": layer_y,
                "note": n_id,
            },
        )

    # Receive message from room group
    def add_agenda(self, event):
        content = event["content"]
        layer_x = event["layer_x"]
        layer_y = event["layer_y"]
        n_id = event["note"]
        id = event["id"]

        # Send message to WebSocket
        self.send(
            text_data=json.dumps(
                {
                    "id": id,
                    "block_type": "agenda",
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "note": n_id,
                }
            )
        )

