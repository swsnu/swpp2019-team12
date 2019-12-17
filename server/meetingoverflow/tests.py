"""
Testing MeetingOverFlow Project
"""
import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import (
    Profile,
    Tag,
    Workspace,
    Note,
    Agenda,
    timezone,
    Calendar,
    File,
    Image,
    Table,
    Todo,
    TextBlock,
)

# URL constants
USER_NAME = "t@t.com"
USER_2_NAME = "j@j.com"
NOTE_ID_CHECK = "note_id: 4"
PROFILE_URL = "/api/profile/"
SIGNUP_URL = "/api/signup/"
SIGNIN_URL = "/api/signin/"
PROFILE_URL_1 = "/api/profile/1/"
WORKSPACE_URL = "/api/workspace/"
WORKSPACE_1_NOTES = "/api/workspace/1/notes/"
NOTE_1_URL = "/api/note/1/"
NOTE_100_URL = "/api/note/100/"
NOTE_1_TEXTBLOCKS_URL = "/api/note/1/textblocks/"
AGENDA_1_TEXTBLOCKS_URL = "/api/agenda/1/textblocks/"
TEXTBLOCK_1_URL = "/api/textblock/1/"
NOTE_1_AGENDAS_URL = "/api/note/1/agendas/"
AGENDA_1_URL = "/api/agenda/1/"
NOTE_1_TODOS_URL = "/api/note/1/todos/"
AGENDA_1_TODOS_URL = "/api/agenda/1/todos/"
TODO_1_URL = "/api/todo/1/"

APP_JSON = "application/json"


class MOFTestCase(TestCase):
    """
    Testing MeetingOverFlow Project
    """

    def setUp(self):
        """
        Setup Before testing everything
        """
        user1 = User.objects.create_user(username=USER_NAME, password="test")
        user1.profile.nickname = "test_nickname"
        user1.save()
        user2 = User.objects.create_user(username=USER_2_NAME, password="test")
        user2.profile.nickname = "test_nickname2"
        user2.save()

        workspace1 = Workspace.objects.create(name="test_workspace")
        workspace1.admins.set([user1.profile])
        workspace1.members.set([user1.profile])
        workspace1.save()
        workspace2 = Workspace.objects.create(name="test_workspace2")
        Workspace.objects.create(name="test_workspace3")

        note1 = Note.objects.create(title="test_note", workspace=workspace1)
        note1.participants.set([user1.profile])
        note1.save()
        note2 = Note.objects.create(title="test_note2", workspace=workspace1)
        note2.participants.set([user1.profile])
        note2.save()
        note3 = Note.objects.create(title="test_note3", workspace=workspace2)
        note3.participants.set([user2.profile])
        note3.save()

        agenda1 = Agenda.objects.create(content="test_content", note=note1)
        Agenda.objects.create(content="test_content2", note=note1)

        Calendar.objects.create(content="test_content", note=note1)
        Calendar.objects.create(
            content="test_content2",
            note=note1,
            parent_agenda=agenda1,
            is_parent_note=False,
        )
        Tag.objects.create(content="test_tag", workspace=workspace1, color="#4287f5")

        File.objects.create(content="test_content", note=note1)
        File.objects.create(
            content="test_content2",
            note=note1,
            parent_agenda=agenda1,
            is_parent_note=False,
        )

        Image.objects.create(content="test_content", note=note1)
        Image.objects.create(
            content="test_content2",
            note=note1,
            parent_agenda=agenda1,
            is_parent_note=False,
        )

        Table.objects.create(content="test_content", note=note1)
        Table.objects.create(
            content="test_content2",
            note=note1,
            parent_agenda=agenda1,
            is_parent_note=False,
        )

        todo1 = Todo.objects.create(
            content="test_content", note=note1, workspace=workspace1
        )
        todo1.assignees.set([user1.profile])
        todo1.save()

        todo2 = Todo.objects.create(
            content="test_content2",
            note=note1,
            parent_agenda=agenda1,
            is_parent_note=False,
        )
        todo2.assignees.set([user1.profile])
        todo2.save()

        Tag.objects.create(content="test_content")
        TextBlock.objects.create(content="test_content", note=note1)
        TextBlock.objects.create(
            content="test_content2",
            note=note1,
            parent_agenda=agenda1,
            is_parent_note=False,
        )

    def test_models(self):
        """
        Testing models
        """
        User.objects.create_user(username="test@test.com", password="test")

        # Profile Model Check
        profile = Profile.objects.get(id=1)
        profile.nickname = "test_nickname"
        profile.save()
        self.assertEqual(str(profile), "id: 1, nickname: test_nickname")

        # Tag Model Check
        tag = Tag(content="test_content")
        tag.save()
        self.assertEqual(str(Tag.objects.get(id=2)), "content: test_content")

        # Workspace Model Check
        workspace = Workspace(name="test_workspace3")
        workspace.save()
        self.assertEqual(str(Workspace.objects.get(id=3)), "name: test_workspace3")

        # Note Model Check
        note = Note(title="test_title", workspace=workspace)
        note.save()
        self.assertEqual(str(Note.objects.get(id=4)), "note_id: 4, title: test_title")

        # Agenda Model Check
        agenda = Agenda(content="test_content", note=note,)
        agenda.save()
        self.assertEqual(str(Agenda.objects.get(id=3)), "note_id: 4, block_id: 3")

        # Calendar Model Check
        calendar = Calendar(content="test_content", note=note)
        calendar.save()
        self.assertEqual(str(Calendar.objects.get(id=3)), NOTE_ID_CHECK)

        # File Model Check
        file = File(content="test_content", note=note, url="abc")
        file.save()
        self.assertEqual(str(File.objects.get(id=3)), "url: abc")

        # Image Model Check
        image = Image(note=note)
        image.save()
        self.assertEqual(str(Image.objects.get(id=3)), NOTE_ID_CHECK)

        # Table Model Check
        table = Table(note=note, content="test_content")
        table.save()
        self.assertEqual(str(Table.objects.get(id=3)), NOTE_ID_CHECK)

        # Todo Model Check
        todo = Todo(note=note)
        todo.save()
        self.assertEqual(str(Todo.objects.get(id=3)), "note_id: 4, todo_id: 3")

        # TextBlock Model Check
        textblock = TextBlock(content="test_content", note=note)
        textblock.save()
        self.assertEqual(str(TextBlock.objects.get(id=3)), "content: test_content")

    def test_user_auth(self):
        """
        Testing user auth
        """
        client = Client(enforce_csrf_checks=False)
        ##########
        # Signup #
        ##########
        response = client.get(SIGNUP_URL)
        self.assertEqual(response.status_code, 405)

        # POST
        response = client.post(
            SIGNUP_URL,
            json.dumps(
                {"wrong": "test_name", "wrong2": "1234", "wrong3": "test_nickname"}
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.post(
            SIGNUP_URL,
            json.dumps({"username": "", "password": "", "nickname": "test_nickname"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.post(
            SIGNUP_URL,
            json.dumps(
                {
                    "username": "test_name",
                    "password": "1234",
                    "nickname": "test_nickname",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 201)

        # PATCH
        response = client.patch(
            SIGNUP_URL, json.dumps({"1": "usable_name"}), content_type=APP_JSON
        )
        self.assertEqual(response.status_code, 400)

        response = client.patch(
            SIGNUP_URL, json.dumps({"username": "usable_name"}), content_type=APP_JSON
        )
        self.assertEqual(response.status_code, 200)

        response = client.patch(
            SIGNUP_URL, json.dumps({"username": "test_name"}), content_type=APP_JSON
        )
        self.assertEqual(response.status_code, 204)

        ##########
        # Signin #
        ##########

        response = client.post(
            SIGNIN_URL,
            json.dumps({"1": "test_name", "2": "1234"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.post(
            SIGNIN_URL,
            json.dumps({"username": "not_exist", "password": "1234"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 401)

        login_response = client.post(
            SIGNIN_URL,
            json.dumps({"username": "test_name", "password": "1234"}),
            content_type=APP_JSON,
        )
        self.assertEqual(login_response.status_code, 200)

        ###########
        # Signout #
        ###########
        csrftoken = login_response.cookies["csrftoken"].value
        response = client.get("/api/signout/", HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

        response = client.get("/api/signout/", HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)

    def test_profile(self):
        """
        Testing profile
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")
        response = client.get(PROFILE_URL)
        self.assertEqual(response.status_code, 200)

        # workspace 입력도 하고, 실제로 db에 workspace 있는 경우
        response = client.post(
            PROFILE_URL,
            json.dumps({"username": "test_name", "workspace_id": 1}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 200)

        response = client.post(
            PROFILE_URL,
            json.dumps({"username": "test_name", "workspace_id": 1000}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.post(
            PROFILE_URL,
            json.dumps({"username": USER_NAME, "workspace_id": 1}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 200)

        # workspace 없는 경우
        response = client.post(
            PROFILE_URL, json.dumps({"username": USER_NAME}), content_type=APP_JSON
        )
        self.assertEqual(response.status_code, 200)

        response = client.post(
            PROFILE_URL,
            json.dumps({"username": "unavailable_test_name"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

    def test_specific_profile(self):
        """
        Testing specific profile
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")
        response = client.get(PROFILE_URL_1)
        self.assertEqual(response.status_code, 200)

        response = client.get("/api/profile/100/")
        self.assertEqual(response.status_code, 404)

        response = client.patch(
            PROFILE_URL_1, json.dumps({"nickname": "test_patch"}), content_type=APP_JSON
        )
        self.assertEqual(response.status_code, 202)

        response = client.patch(
            "/api/profile/1000/",
            json.dumps({"nickname": "test_patch"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.patch(
            PROFILE_URL_1,
            json.dumps({"nickname": "longer_than_20_maximum_wowwowwowwowwowwowwow"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

    def test_workspace(self):
        """
        Testing workspace
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get(WORKSPACE_URL)
        self.assertEqual(response.status_code, 200)

        client.login(username=USER_2_NAME, password="test")
        response = client.get(WORKSPACE_URL)
        self.assertEqual(response.status_code, 404)

        response = client.post(
            WORKSPACE_URL,
            json.dumps({"nae": "test_workspace", "admis": [2], "membes": [1, 2]}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.post(
            WORKSPACE_URL,
            json.dumps({"name": "test_workspace", "admins": [100], "members": [1, 2]}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.post(
            WORKSPACE_URL,
            json.dumps({"name": "test_workspace", "admins": [2], "members": [100]}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.post(
            WORKSPACE_URL,
            json.dumps({"name": "test_workspace", "admins": [2], "members": [1, 2]}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 201)

    def test_specific_workspace(self):
        """
        Testing specific workspace
        """
        workspace_url_1 = "/api/workspace/1/"
        workspace_url_100 = "/api/workspace/100/"
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get(workspace_url_1)
        self.assertEqual(response.status_code, 200)

        response = client.get(workspace_url_100)
        self.assertEqual(response.status_code, 404)

        response = client.patch(
            workspace_url_100,
            json.dumps({"name": "test_workspace"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.patch(
            workspace_url_1, json.dumps({"members": [1, 2]}), content_type=APP_JSON
        )
        self.assertEqual(response.status_code, 202)

        response = client.patch(
            workspace_url_1, json.dumps({"members": [3]}), content_type=APP_JSON
        )
        self.assertEqual(response.status_code, 400)

        response = client.delete(workspace_url_100)
        self.assertEqual(response.status_code, 404)

        response = client.delete(workspace_url_1)
        self.assertEqual(response.status_code, 200)

    def test_workspace_todo(self):
        """
        Testing workspace todo
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")
        response = client.get("/api/workspace/2/todos/")
        self.assertEqual(response.status_code, 404)

        response = client.get("/api/workspace/1/todos/")
        self.assertEqual(response.status_code, 200)

    def test_workspace_agenda(self):
        """
        Testing workspace agenda
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")
        response = client.get("/api/workspace/2/agendas/")
        self.assertEqual(response.status_code, 404)

        response = client.get("/api/workspace/100/agendas/")
        self.assertEqual(response.status_code, 400)

        response = client.get("/api/workspace/1/agendas/")
        self.assertEqual(response.status_code, 200)

    def test_notes(self):
        """
        Testing notes
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        # GET
        response = client.get("/api/workspace/5/notes/")
        self.assertEqual(response.status_code, 400)

        response = client.get("/api/workspace/3/notes/")
        self.assertEqual(response.status_code, 404)

        response = client.get(WORKSPACE_1_NOTES)
        self.assertEqual(response.status_code, 200)

        # POST
        datetime = str(timezone.now())
        response = client.post(
            WORKSPACE_1_NOTES,
            json.dumps(
                {
                    "title": "test_title",
                    "participants": [USER_NAME],
                    "createdAt": datetime,
                    "lastModifiedAt": datetime,
                    "location": "Seoul",
                    "workspace": 1,
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 201)

        # keyerror
        response = client.post(
            WORKSPACE_1_NOTES,
            json.dumps(
                {
                    "tile": "test_title",
                    "pants": [USER_NAME],
                    "createdAt": datetime,
                    "lastModifiedAt": datetime,
                    "location": "Seoul",
                    "workspace": 1,
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.post(
            WORKSPACE_1_NOTES,
            json.dumps(
                {
                    "title": "test_title",
                    "participants": ["non_existing_username"],
                    "createdAt": datetime,
                    "lastModifiedAt": datetime,
                    "location": "Seoul",
                    "workspace": 1,
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

    def test_specific_note(self):
        """
        Testing specific notes
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get(NOTE_1_URL)
        self.assertEqual(response.status_code, 200)

        response = client.get(NOTE_100_URL)
        self.assertEqual(response.status_code, 404)

        response = client.patch(
            NOTE_100_URL, json.dumps({"title": "patch_title"}), content_type=APP_JSON
        )
        self.assertEqual(response.status_code, 404)

        response = client.patch(
            NOTE_1_URL, json.dumps({"title": "patch_title"}), content_type=APP_JSON
        )
        self.assertEqual(response.status_code, 202)

        response = client.patch(
            NOTE_1_URL,
            json.dumps(
                {
                    "title": """title_very_very_long_longer_than_100_
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz"""
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.delete(NOTE_100_URL)
        self.assertEqual(response.status_code, 404)

        response = client.delete(NOTE_1_URL)
        self.assertEqual(response.status_code, 200)

    def test_sibling_notes(self):
        """
        Testing sibling notes
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/siblingnotes/1/")
        self.assertEqual(response.status_code, 200)

        response = client.get("/api/siblingnotes/100/")
        self.assertEqual(response.status_code, 404)

        response = client.get("/api/siblingnotes/3/")
        self.assertEqual(response.status_code, 404)

    def test_textblock_child_of_note(self):
        """
        Testing textblocks of note
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/note/100/textblocks/")
        self.assertEqual(response.status_code, 404)

        response = client.get(NOTE_1_TEXTBLOCKS_URL)
        self.assertEqual(response.status_code, 200)

        response = client.post(
            "/api/note/100/textblocks/",
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 0,
                    "layer_y": 0,
                    "document_id": "asfecsm3242a",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.post(
            NOTE_1_TEXTBLOCKS_URL,
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 0,
                    "layer_y": 0,
                    "document_id": "asfecsm3242a",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 201)

        response = client.post(
            NOTE_1_TEXTBLOCKS_URL,
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 3.333,
                    "layer_y": 0,
                    "document_id": "asfecsm3242a",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

    def test_textblock_child_of_agenda(self):
        """
        Testing textblock of agenda
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/agenda/100/textblocks/")
        self.assertEqual(response.status_code, 404)

        response = client.get(AGENDA_1_TEXTBLOCKS_URL)
        self.assertEqual(response.status_code, 200)

        response = client.get("/api/agenda/2/textblocks/")
        self.assertEqual(response.status_code, 404)

        response = client.post(
            AGENDA_1_TEXTBLOCKS_URL,
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 3.333,
                    "layer_y": 0,
                    "document_id": "asfecsm3242a",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.post(
            AGENDA_1_TEXTBLOCKS_URL,
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 0,
                    "layer_y": 0,
                    "document_id": "asfecsm3242a",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 201)

    def test_modify_textblock(self):
        """
        Testing modify textblock
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/textblock/100/")
        self.assertEqual(response.status_code, 404)

        response = client.get(TEXTBLOCK_1_URL)
        self.assertEqual(response.status_code, 200)

        response = client.patch(
            TEXTBLOCK_1_URL,
            json.dumps({"content": "test_content", "layer_x": 3.33, "layer_y": 0}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.patch(
            TEXTBLOCK_1_URL,
            json.dumps({"content": "test_content", "layer_x": 0, "layer_y": 0}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 202)

        response = client.delete(TEXTBLOCK_1_URL)
        self.assertEqual(response.status_code, 200)

    def test_agenda_child_of_note(self):
        """
        Testing agenda of note
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/note/2/agendas/")
        self.assertEqual(response.status_code, 404)

        response = client.get(NOTE_1_AGENDAS_URL)
        self.assertEqual(response.status_code, 200)

        response = client.post(
            "/api/note/100/agendas/",
            json.dumps({"content": "test_content", "layer_x": 0, "layer_y": 0}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.post(
            NOTE_1_AGENDAS_URL,
            json.dumps({"content": "test_content", "layer_x": 0, "layer_y": 0}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 201)

        response = client.post(
            NOTE_1_AGENDAS_URL,
            json.dumps({"content": "test_content", "layer_x": 3.333, "layer_y": 0}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

    def test_modify_agenda(self):
        """
        Testing modify agenda
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/agenda/100/")
        self.assertEqual(response.status_code, 404)

        response = client.get(AGENDA_1_URL)
        self.assertEqual(response.status_code, 200)

        response = client.patch(
            AGENDA_1_URL,
            json.dumps({"content": "test_content", "layer_x": 3.33, "layer_y": 0,}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.patch(
            AGENDA_1_URL,
            json.dumps({"content": "test_content", "layer_x": 0, "layer_y": 0,}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 202)

        response = client.delete(AGENDA_1_URL)
        self.assertEqual(response.status_code, 200)

    def test_todoblock_child_of_note(self):
        """
        Testing todoblock of note
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/note/2/todos/")
        self.assertEqual(response.status_code, 404)

        response = client.get(NOTE_1_TODOS_URL)
        self.assertEqual(response.status_code, 200)

        response = client.post(
            "/api/note/100/todos/",
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 0,
                    "layer_y": 0,
                    "assignees": [1],
                    "due_date": "2020-02-07",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.post(
            NOTE_1_TODOS_URL,
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 0,
                    "layer_y": 0,
                    "assignees": [1],
                    "due_date": "2020-02-07",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 201)

        response = client.post(
            NOTE_1_TODOS_URL,
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 3.333,
                    "layer_y": 0,
                    "assignees": [1],
                    "due_date": "2020-02-07",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

    def test_todoblock_child_of_agenda(self):
        """
        Testing todoblock of agenda
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/agenda/100/todos/")
        self.assertEqual(response.status_code, 404)

        response = client.get(AGENDA_1_TODOS_URL)
        self.assertEqual(response.status_code, 200)

        response = client.get("/api/agenda/2/todos/")
        self.assertEqual(response.status_code, 404)

        response = client.post(
            AGENDA_1_TODOS_URL,
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 3.333,
                    "layer_y": 0,
                    "assignees": [1],
                    "due_date": "2020-02-07",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.post(
            AGENDA_1_TODOS_URL,
            json.dumps(
                {
                    "content": "test_content",
                    "layer_x": 0,
                    "layer_y": 0,
                    "assignees": [1],
                    "due_date": "2020-02-07",
                }
            ),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 201)

    def test_modify_todoblock(self):
        """
        Testing modify todoblock
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/todo/100/")
        self.assertEqual(response.status_code, 404)

        response = client.get(TODO_1_URL)
        self.assertEqual(response.status_code, 200)

        response = client.patch(
            TODO_1_URL,
            json.dumps({"content": "test_content", "layer_x": 3.33, "layer_y": 0,}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 400)

        response = client.patch(
            TODO_1_URL,
            json.dumps({"content": "test_content", "layer_x": 0, "layer_y": 0,}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 202)

        response = client.delete(TODO_1_URL)
        self.assertEqual(response.status_code, 200)

    def test_api_tag(self):
        """
        Testing api tag
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")

        response = client.get("/api/workspace/100/tag/")
        self.assertEqual(response.status_code, 404)

        response = client.get("/api/workspace/1/tag/")
        self.assertEqual(response.status_code, 200)

        response = client.post("/api/workspace/1/tag/", json.dumps({
            "content": "test1",
            "workspaceId":1
        }), APP_JSON)
        self.assertEqual(response.status_code, 201)
        response = client.post("/api/workspace/1/tag/", json.dumps({
            "content": """title_very_very_long_longer_than_100_
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz""",
            "workspaceId":1
        }), APP_JSON)
        self.assertEqual(response.status_code, 400)


    def test_children_blocks_of_agenda(self):
        """
        Testing children blocks of agenda
        """

        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")
        
        response = client.get('/api/agenda/100/childrenblocks/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/agenda/1/childrenblocks/')
        self.assertEqual(response.status_code, 200)

        response = client.patch(
            '/api/agenda/101/childrenblocks/',
            json.dumps({"children_blocks": "test"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.patch(
            '/api/agenda/1/childrenblocks/',
            json.dumps({"children_blocks": "test"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 202)

    def test_children_blocks_of_note(self):
        """
        Testing children blocks of note
        """
        client = Client(enforce_csrf_checks=False)
        client.login(username=USER_NAME, password="test")
        
        response = client.get('/api/note/100/childrenblocks/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/note/1/childrenblocks/')
        self.assertEqual(response.status_code, 200)

        response = client.patch(
            '/api/note/101/childrenblocks/',
            json.dumps({"children_blocks": "test"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 404)

        response = client.patch(
            '/api/note/1/childrenblocks/',
            json.dumps({"children_blocks": "test"}),
            content_type=APP_JSON,
        )
        self.assertEqual(response.status_code, 202)