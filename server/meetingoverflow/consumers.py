import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .serializers import AgendaSerializer, TextBlockSerializer
from .models import Agenda


class BlockConsumer(WebsocketConsumer):
    """
        Socket 열어둘 때, send에 맞는 처리하는 Consumer
    """

    def connect(self):
        """
            Socket connection
        """
        self.room_group_name = "note_" + str(
            self.scope["url_route"]["kwargs"]["note_id"]
        )

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        """
            when socket disconnects
        """
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        """
        # Receive message from WebSocket
        """
        block_data_json = json.loads(text_data)
        print(block_data_json)

        # 현재는 여기서 모든 action에 대해서 모두 처리하게 되어있는데 이건 시간이 된다면 따로 따로 구현하는게 좋을듯.
        # Block을 Add하는 것과 관련된 receive...
        if "block_type" in block_data_json:
            block_type = block_data_json["block_type"]

            if block_type == "Agenda":
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
                # valid 안하면 나가기
                else:
                    print("err")

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
            elif block_type == "Text":
                content = block_data_json["content"]
                layer_x = block_data_json["layer_x"]
                layer_y = block_data_json["layer_y"]
                document_id = block_data_json["document_id"]
                n_id = block_data_json["n_id"]

                data = {
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "document_id": document_id,
                    "note": n_id,
                    "is_parent_note": True,
                }
                serializer = TextBlockSerializer(data=data)
                if serializer.is_valid():
                    text = serializer.save()

                # Send message to room group
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        "type": "add_text",
                        "id": text.id,
                        "content": content,
                        "layer_x": layer_x,
                        "layer_y": layer_y,
                        "document_id": document_id,
                        "note": n_id,
                    },
                )
        # 1) Block을 Drag해서 위치가 변화하는걸 받는 receive
        # 2) Block을 제거해서 변화하는 경우를 받는 receive
        else:
            """
            # Send message to room group
            """
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {"type": "change_children_blocks", "children_blocks": block_data_json,},
            )

    # Receive message from room group
    def add_agenda(self, event):
        """
        # Send message to WebSocket
        """
        content = event["content"]
        layer_x = event["layer_x"]
        layer_y = event["layer_y"]
        n_id = event["note"]
        a_id = event["id"]

        # Send message to WebSocket
        self.send(
            text_data=json.dumps(
                {
                    "id": a_id,
                    "block_type": "Agenda",
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "note": n_id,
                }
            )
        )

    def add_text(self, event):
        """
        # Send message to WebSocket
        """
        content = event["content"]
        layer_x = event["layer_x"]
        layer_y = event["layer_y"]
        n_id = event["note"]
        t_id = event["id"]
        document_id = event["document_id"]
        self.send(
            text_data=json.dumps(
                {
                    "id": t_id,
                    "block_type": "Text",
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "document_id": document_id,
                    "note": n_id,
                }
            )
        )

    def change_children_blocks(self, event):
        """
        # Send message to WebSocket
        """
        children_blocks = event["children_blocks"]
        self.send(text_data=json.dumps({"children_blocks": children_blocks,}))


class AgendaConsumer(WebsocketConsumer):
    """
        For changing agenda child blocks
    """

    def connect(self):
        self.room_group_name = "agenda_" + str(
            self.scope["url_route"]["kwargs"]["agenda_id"]
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
        document_id = block_data_json["document_id"]
        n_id = block_data_json["n_id"]

        data = {
            "content": content,
            "layer_x": layer_x,
            "layer_y": layer_y,
            "document_id": document_id,
            "note": n_id,
            "is_parent_note": True,
        }
        serializer = TextBlockSerializer(data=data)
        if serializer.is_valid():
            text = serializer.save()

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "add_text",
                "id": text.id,
                "content": content,
                "layer_x": layer_x,
                "layer_y": layer_y,
                "document_id": document_id,
                "note": n_id,
            },
        )

    # Receive message from room group
    def add_text(self, event):
        """
            temporary
        """
        content = event["content"]
        layer_x = event["layer_x"]
        layer_y = event["layer_y"]
        n_id = event["note"]
        t_id = event["id"]
        document_id = event["document_id"]
        # Send message to WebSocket
        self.send(
            text_data=json.dumps(
                {
                    "id": t_id,
                    "block_type": "Text",
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "document_id": document_id,
                    "note": n_id,
                }
            )
        )
