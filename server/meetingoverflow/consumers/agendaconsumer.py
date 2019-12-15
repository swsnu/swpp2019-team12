import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from ..serializers import (
    AgendaSerializer,
    TextBlockSerializer,
    TodoSerializer,
    ImageSerializer,
)
from ..models import Agenda


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

        operation_type = block_data_json["operation_type"]
        if operation_type == "add_block":
            block_type = block_data_json["block"]["block_type"]
            if block_type == "Text":
                content = block_data_json["block"]["content"]
                layer_x = block_data_json["block"]["layer_x"]
                layer_y = block_data_json["block"]["layer_y"]
                document_id = block_data_json["block"]["document_id"]
                a_id = block_data_json["block"]["a_id"]
                n_id = block_data_json["block"]["n_id"]
                # Send message to room group

                data = {
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "document_id": document_id,
                    "note": n_id,
                    "is_parent_note": False,
                    "parent_agenda": a_id,
                }

                serializer = TextBlockSerializer(data=data)
                if serializer.is_valid():
                    text = serializer.save()

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
                        "parent_agenda": a_id,
                    },
                )
            elif block_type == "Image":
                content = block_data_json["block"]["content"]
                layer_x = block_data_json["block"]["layer_x"]
                layer_y = block_data_json["block"]["layer_y"]
                image = block_data_json["block"]["image"]
                a_id = block_data_json["block"]["a_id"]
                n_id = block_data_json["block"]["n_id"]

                data = {
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "note": n_id,
                    "image": image,
                    "is_parent_note": False,
                    "is_submitted": False,
                    "parent_agenda": a_id,
                }

                serializer = ImageSerializer(data=data)
                if serializer.is_valid():
                    image = serializer.save()

                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        "type": "add_image",
                        "id": image.id,
                        "content": content,
                        "layer_x": layer_x,
                        "layer_y": layer_y,
                        "parent_agenda": a_id,
                        "note": "n_id",
                    },
                )

            elif block_type == "TodoContainer":
                content = block_data_json["block"]["content"]
                layer_x = block_data_json["block"]["layer_x"]
                layer_y = block_data_json["block"]["layer_y"]
                due_date = block_data_json["block"]["due_date"]
                assignees = block_data_json["block"]["assignees"]
                n_id = block_data_json["block"]["n_id"]
                a_id = block_data_json["block"]["a_id"]

                data = {
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "due_date": due_date,
                    "assignnes": assignees,
                    "note": n_id,
                    "parent_agenda": a_id,
                    "is_parent_note": False,
                }

                serializer = TodoSerializer(data=data)
                if serializer.is_valid():
                    todo = serializer.save()

                # Send message to room group
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        "type": "add_todo",
                        "id": todo.id,
                        "content": content,
                        "layer_x": layer_x,
                        "layer_y": layer_y,
                        "due_date": due_date,
                        "is_parent_note": False,
                        "parent_agenda": a_id,
                        "assignees": assignees,
                    },
                )

        elif operation_type == "change_agenda":
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "change_agenda",
                    "content": block_data_json["updated_agenda"],
                },
            )
        else:
            """
            # Send message to room group
            """
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "change_children_blocks",
                    "children_blocks": block_data_json["children_blocks"],
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
        t_id = event["id"]
        document_id = event["document_id"]
        parent_agenda = event["parent_agenda"]
        n_id = event["note"]
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
                    "parent_agenda": parent_agenda,
                    "note": n_id,
                    "is_parent_note": False,
                }
            )
        )

    def add_image(self, event):
        """
            # Add ImageBlock whose parent is agenda.
        """
        i_id = event["id"]
        n_id = event["note"]
        content = event["content"]
        layer_x = event["layer_x"]
        layer_y = event["layer_y"]
        parent_agenda = event["parent_agenda"]
        # Send message to WebSocket

        self.send(
            text_data=json.dumps(
                {
                    "id": i_id,
                    "block_type": "Image",
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "note": n_id,
                    "is_parent_note": False,
                    "is_submitted": False,
                    "parent_agenda": parent_agenda,
                }
            )
        )

    def add_todo(self, event):
        """
            temporary
        """
        t_id = event["id"]
        content = event["content"]
        layer_x = event["layer_x"]
        layer_y = event["layer_y"]
        due_date = event["due_date"]
        is_parent_note = event["is_parent_note"]
        parent_agenda = event["parent_agenda"]
        assignees = event["assignees"]
        # Send message to WebSocket
        self.send(
            text_data=json.dumps(
                {
                    "id": t_id,
                    "block_type": "TodoContainer",
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "due_date": due_date,
                    "is_parent_note": is_parent_note,
                    "parent_agenda": parent_agenda,
                    "assignees": assignees,
                    "is_done": False,
                }
            )
        )

    def change_children_blocks(self, event):
        """
        # Send message to WebSocket
        """
        children_blocks = event["children_blocks"]
        self.send(text_data=json.dumps({"children_blocks": children_blocks, }))

    def change_agenda(self, event):
        """
            change title of agenda
        """
        updated_agenda = event["content"]
        self.send(
            text_data=json.dumps(
                {"operation_type": "change_agenda",
                    "updated_agenda": updated_agenda, }
            )
        )
