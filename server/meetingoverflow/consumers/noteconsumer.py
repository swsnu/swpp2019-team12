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
        operation_type = block_data_json["operation_type"]
        # 현재는 여기서 모든 action에 대해서 모두 처리하게 되어있는데 이건 시간이 된다면 따로 따로 구현하는게 좋을듯.
        # Block을 Add하는 것과 관련된 receive...
        if operation_type == "add_block":
            block_type = block_data_json["block"]["block_type"]

            if block_type == "Agenda":
                content = block_data_json["block"]["content"]
                layer_x = block_data_json["block"]["layer_x"]
                layer_y = block_data_json["block"]["layer_y"]
                n_id = block_data_json["block"]["n_id"]

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
                content = block_data_json["block"]["content"]
                layer_x = block_data_json["block"]["layer_x"]
                layer_y = block_data_json["block"]["layer_y"]
                document_id = block_data_json["block"]["document_id"]
                n_id = block_data_json["block"]["n_id"]

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
            elif block_type == "TodoContainer":
                content = block_data_json["block"]["content"]
                layer_x = block_data_json["block"]["layer_x"]
                layer_y = block_data_json["block"]["layer_y"]
                assignees = block_data_json["block"]["assignees"]
                n_id = block_data_json["block"]["n_id"]
                due_date = block_data_json["block"]["due_date"]

                data = {
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "assignnes": assignees,
                    "note": n_id,
                    "due_date": due_date,
                    "is_parent_note": True,
                }

                serializer = TodoSerializer(data=data)
                if serializer.is_valid():
                    todo = serializer.save()

                # Send message to room group
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        "type": "add_todo_note",
                        "id": todo.id,
                        "content": content,
                        "layer_x": layer_x,
                        "layer_y": layer_y,
                        "assignees": assignees,
                        "note": n_id,
                        "due_date": due_date,
                    },
                )
            elif block_type == "Image":
                content = block_data_json["block"]["content"]
                layer_x = block_data_json["block"]["layer_x"]
                layer_y = block_data_json["block"]["layer_y"]
                n_id = block_data_json["block"]["n_id"]
                image = block_data_json["block"]["image"]
                data = {
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "note": n_id,
                    "image": image,
                    "is_parent_note": True,
                    "is_submitted": False,
                }

                serializer = ImageSerializer(data=data)
                if serializer.is_valid():
                    image = serializer.save()

                # Send message to room group
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        "type": "add_image_note",
                        "id": image.id,
                        "content": content,
                        "layer_x": layer_x,
                        "layer_y": layer_y,
                        "note": n_id,
                    },
                )
        elif block_data_json["operation_type"] == "change_title":
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "change_title",
                    "updated_title": block_data_json["updated_title"],
                },
            )
        elif block_data_json["operation_type"] == "change_location":
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "change_location",
                    "updated_location": block_data_json["updated_location"],
                },
            )

        elif block_data_json["operation_type"] == "change_datetime":
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "change_datetime",
                    "updated_datetime": block_data_json["updated_datetime"],
                },
            )
        # 1) Block을 Drag해서 위치가 변화하는걸 받는 receive
        # 2) Block을 제거해서 변화하는 경우를 받는 receive
        # 3) Image block에 실제 image patch하는 경우.

        # 위의 경우에 해당하는 애들도 다 else로 처리하지 말고 리스트 만들어서 바꾸자.
        # elif block_data_json["operation_type"] == "patch_image":
        #     async_to_sync(self.channel_layer.group_send)(
        #         self.room_group_name,
        #         {
        #             "type": "patch_image",
        #             "children_blocks": block_data_json["children_blocks"],
        #         },
        #     )
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

    # def add_tag(self, event):
    #     """
    #     # Send message to WebSocket
    #     """
    #     content = event["content"]
    #     color = event["color"]
    #     workspace_id = event["workspace"]
    #     tag_id = event["id"]

    #     self.send(
    #         text_data=json.dumps(
    #             {
    #                 "id": tag_id,
    #                 "block_type": "Tag",
    #                 "content": content,
    #                 "color": color,
    #                 "workspace": workspace_id
    #             }
    #         )
    #     )

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

    def add_todo_note(self, event):
        """
        # Add TodoBlock whose parent is note.
        """
        content = event["content"]
        layer_x = event["layer_x"]
        layer_y = event["layer_y"]
        assignees = event["assignees"]
        due_date = event["due_date"]
        n_id = event["note"]
        t_id = event["id"]

        self.send(
            text_data=json.dumps(
                {
                    "id": t_id,
                    "block_type": "TodoContainer",
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "assignees": assignees,
                    "due_date": due_date,
                    "note": n_id,
                    "is_parent_note": True,
                    "is_done": False,
                    "parent_agenda": None,
                }
            )
        )

    def add_image_note(self, event):
        """
        # Add ImageBlock whose parent is note.
        """
        content = event["content"]
        layer_x = event["layer_x"]
        layer_y = event["layer_y"]
        n_id = event["note"]
        i_id = event["id"]

        self.send(
            text_data=json.dumps(
                {
                    "id": i_id,
                    "block_type": "Image",
                    "content": content,
                    "layer_x": layer_x,
                    "layer_y": layer_y,
                    "note": n_id,
                    "is_parent_note": True,
                    "parent_agenda": None,
                    "is_submitted": False,
                }
            )
        )

    def change_title(self, event):
        """
            change title of Note
        """
        updated_title = event["updated_title"]
        self.send(
            text_data=json.dumps(
                {"operation_type": "change_title", "updated_title": updated_title}
            )
        )

    def change_location(self, event):
        """
            change location of Note
        """
        updated_location = event["updated_location"]
        self.send(
            text_data=json.dumps(
                {
                    "operation_type": "change_location",
                    "updated_location": updated_location,
                }
            )
        )

    def change_datetime(self, event):
        """
            change title of Note
        """
        updated_datetime = event["updated_datetime"]
        self.send(
            text_data=json.dumps(
                {
                    "operation_type": "change_datetime",
                    "updated_datetime": updated_datetime,
                }
            )
        )

    def change_children_blocks(self, event):
        """
        # Send message to WebSocket
        """
        children_blocks = event["children_blocks"]
        self.send(text_data=json.dumps({"children_blocks": children_blocks, }))
