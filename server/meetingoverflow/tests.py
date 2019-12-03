from django.test import TestCase, Client
import json
from django.contrib.auth.models import User
from .models import *

# Profile, Tag, Workspace, Note, Agenda, Calendar, File, Image, Table, Todo, TextBlock


class MOFTestCase(TestCase):

    def setUp(self):
        user1 = User.objects.create_user(username='t@t.com', password="test")
        user1.profile.nickname = "test_nickname"
        user1.save()
        user2 = User.objects.create_user(username='j@j.com', password="test")
        user2.profile.nickname = "test_nickname2"
        user2.save()

        workspace1 = Workspace.objects.create(name="test_workspace")
        workspace1.admins.set([user1.profile])
        workspace1.members.set([user1.profile])
        workspace1.save()
        workspace2 = Workspace.objects.create(name="test_workspace2")
        workspace3 = Workspace.objects.create(name="test_workspace3")

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
        agenda2 = Agenda.objects.create(content="test_content2", note=note1)

        calendar1 = Calendar.objects.create(content="test_content", note=note1)
        calendar2 = Calendar.objects.create(
            content="test_content2", note=note1, parent_agenda=agenda1, is_parent_note=False)

        file1 = File.objects.create(content="test_content", note=note1)
        file2 = File.objects.create(
            content="test_content2", note=note1, parent_agenda=agenda1, is_parent_note=False)

        image1 = Image.objects.create(content="test_content", note=note1)
        image2 = Image.objects.create(
            content="test_content2", note=note1, parent_agenda=agenda1, is_parent_note=False)

        table1 = Table.objects.create(content="test_content", note=note1)
        table2 = Table.objects.create(
            content="test_content2", note=note1, parent_agenda=agenda1, is_parent_note=False)

        todo1 = Todo.objects.create(
            content="test_content", note=note1, workspace=workspace1)
        todo1.assignees.set([user1.profile])
        todo1.save()

        todo2 = Todo.objects.create(
            content="test_content2", note=note1, parent_agenda=agenda1, is_parent_note=False)
        todo2.assignees.set([user1.profile])
        todo2.save()

        tag1 = Tag.objects.create(content="test_content")
        text1 = TextBlock.objects.create(content="test_content", note=note1)
        text2 = TextBlock.objects.create(
            content="test_content2", note=note1, parent_agenda=agenda1, is_parent_note=False)

    def test_models(self):
        User.objects.create_user(username='test@test.com', password="test")

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
        self.assertEqual(str(Workspace.objects.get(id=3)),
                         "name: test_workspace3")

        # Note Model Check
        note = Note(title="test_title", workspace=workspace)
        note.save()
        self.assertEqual(str(Note.objects.get(id=4)), "title: test_title")

        # Agenda Model Check
        agenda = Agenda(
            content="test_content",
            note=note,
        )
        agenda.save()
        self.assertEqual(str(Agenda.objects.get(id=3)), "note_id: 4")

        # Calendar Model Check
        calendar = Calendar(
            content="test_content",
            note=note
        )
        calendar.save()
        self.assertEqual(str(Calendar.objects.get(id=3)), "note_id: 4")

        # File Model Check
        file = File(
            content="test_content",
            note=note,
            url="abc"
        )
        file.save()
        self.assertEqual(str(File.objects.get(id=3)), "url: abc")

        # Image Model Check
        image = Image(
            note=note
        )
        image.save()
        self.assertEqual(str(Image.objects.get(id=3)), "note_id: 4")

        # Table Model Check
        table = Table(
            note=note,
            content="test_content"
        )
        table.save()
        self.assertEqual(str(Table.objects.get(id=3)), "note_id: 4")

        # Todo Model Check
        todo = Todo(
            note=note
        )
        todo.save()
        self.assertEqual(str(Todo.objects.get(id=3)), "note_id: 4")

        # TextBlock Model Check
        textblock = TextBlock(
            content="test_content",
            note=note
        )
        textblock.save()
        self.assertEqual(str(TextBlock.objects.get(id=3)),
                         "content: test_content")

    def test_user_auth(self):
        client = Client(enforce_csrf_checks=False)
        ##########
        # Signup #
        ##########
        response = client.get('/api/signup/')
        self.assertEqual(response.status_code, 405)

        # POST
        response = client.post('/api/signup/',
                               json.dumps({
                                   'wrong': 'test_name',
                                   'wrong2': '1234',
                                   'wrong3': 'test_nickname'
                               }),
                               content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.post('/api/signup/',
                               json.dumps({
                                   'username': '',
                                   'password': '',
                                   'nickname': 'test_nickname'
                               }),
                               content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.post('/api/signup/',
                               json.dumps({
                                   'username': 'test_name',
                                   'password': '1234',
                                   'nickname': 'test_nickname'
                               }),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # PATCH
        response = client.patch('/api/signup/',
                                json.dumps({
                                    '1': 'usable_name'
                                }),
                                content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.patch('/api/signup/',
                                json.dumps({
                                    'username': 'usable_name'
                                }),
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = client.patch('/api/signup/',
                                json.dumps({
                                    'username': 'test_name'
                                }),
                                content_type='application/json')
        self.assertEqual(response.status_code, 204)

        ##########
        # Signin #
        ##########

        response = client.post('/api/signin/', json.dumps({
            '1': 'test_name',
            '2': '1234'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.post('/api/signin/', json.dumps({
            'username': 'not_exist',
            'password': '1234'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)

        login_response = client.post('/api/signin/', json.dumps({
            'username': 'test_name',
            'password': '1234'
        }), content_type='application/json')
        self.assertEqual(login_response.status_code, 200)

        ###########
        # Signout #
        ###########
        csrftoken = login_response.cookies['csrftoken'].value
        response = client.get('/api/signout/', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

        response = client.get('/api/signout/', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)

    def test_profile(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")
        response = client.get('/api/profile/')
        self.assertEqual(response.status_code, 200)

        # workspace 입력도 하고, 실제로 db에 workspace 있는 경우
        response = client.post('/api/profile/', json.dumps({
            'username': 'test_name',
            'workspace_id': 1
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/profile/', json.dumps({
            'username': 'test_name',
            'workspace_id': 1000
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post('/api/profile/', json.dumps({
            'username': 't@t.com',
            'workspace_id': 1
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # workspace 없는 경우
        response = client.post('/api/profile/', json.dumps({
            'username': 't@t.com'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/profile/', json.dumps({
            'username': 'unavailable_test_name'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_specific_profile(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password='test')
        response = client.get('/api/profile/1/')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/profile/100/')
        self.assertEqual(response.status_code, 404)

        response = client.patch('/api/profile/1/', json.dumps({
            'nickname': "test_patch"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 202)

        response = client.patch('/api/profile/1000/', json.dumps({
            'nickname': "test_patch"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.patch('/api/profile/1/', json.dumps({
            'nickname': "longer_than_20_maximum_wowwowwowwowwowwowwow"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_workspace(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        response = client.get('/api/workspace/')
        self.assertEqual(response.status_code, 200)

        client.login(username='j@j.com', password="test")
        response = client.get('/api/workspace/')
        self.assertEqual(response.status_code, 404)

        response = client.post('/api/workspace/', json.dumps({
            'nae': 'test_workspace',
            'admis': [2],
            'membes': [1, 2]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.post('/api/workspace/', json.dumps({
            'name': 'test_workspace',
            'admins': [100],
            'members': [1, 2]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post('/api/workspace/', json.dumps({
            'name': 'test_workspace',
            'admins': [2],
            'members': [100]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post('/api/workspace/', json.dumps({
            'name': 'test_workspace',
            'admins': [2],
            'members': [1, 2]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_specific_workspace(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password='test')

        response = client.get('/api/workspace/1/')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/workspace/100/')
        self.assertEqual(response.status_code, 404)

        response = client.patch('/api/workspace/100/', json.dumps({
            'name': 'test_workspace'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.patch('/api/workspace/1/', json.dumps({
            'members': [1, 2]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 202)

        response = client.patch('/api/workspace/1/', json.dumps({
            'members': [3]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.delete('/api/workspace/100/')
        self.assertEqual(response.status_code, 404)

        response = client.delete('/api/workspace/1/')
        self.assertEqual(response.status_code, 200)

    def test_workspace_todo(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")
        response = client.get('/api/workspace/2/todos/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/workspace/1/todos/')
        self.assertEqual(response.status_code, 200)

    def test_workspace_agenda(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")
        response = client.get('/api/workspace/2/agendas/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/workspace/100/agendas/')
        self.assertEqual(response.status_code, 400)

        response = client.get('/api/workspace/1/agendas/')
        self.assertEqual(response.status_code, 200)

    def test_notes(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        # GET
        response = client.get('/api/workspace/5/notes/')
        self.assertEqual(response.status_code, 400)

        response = client.get('/api/workspace/3/notes/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/workspace/1/notes/')
        self.assertEqual(response.status_code, 200)

        # POST
        datetime = str(timezone.now())
        response = client.post('/api/workspace/1/notes/', json.dumps({
            'title': 'test_title',
            'participants': ["t@t.com"],
            'createdAt':  datetime,
            'lastModifiedAt':  datetime,
            'location': 'Seoul',
            'workspace': 1,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # keyerror
        response = client.post('/api/workspace/1/notes/', json.dumps({
            'tile': 'test_title',
            'pants': ["t@t.com"],
            'createdAt':  datetime,
            'lastModifiedAt':  datetime,
            'location': 'Seoul',
            'workspace': 1,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.post('/api/workspace/1/notes/', json.dumps({
            'title': 'test_title',
            'participants': ["non_existing_username"],
            'createdAt':  datetime,
            'lastModifiedAt':  datetime,
            'location': 'Seoul',
            'workspace': 1,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_specific_note(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        response = client.get('/api/note/1/')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/note/100/')
        self.assertEqual(response.status_code, 404)

        response = client.patch('/api/note/100/', json.dumps({
            'title': 'patch_title'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.patch('/api/note/1/', json.dumps({
            'title': 'patch_title'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 202)

        response = client.patch('/api/note/1/', json.dumps({
            'title': """title_very_very_long_longer_than_100_
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz
                        abcdefghijklmnopqrstuvwxyz"""
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.delete('/api/note/100/')
        self.assertEqual(response.status_code, 404)

        response = client.delete('/api/note/1/')
        self.assertEqual(response.status_code, 200)

    def test_sibling_notes(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        response = client.get('/api/siblingnotes/1/')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/siblingnotes/100/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/siblingnotes/3/')
        self.assertEqual(response.status_code, 404)

    def test_textblock_child_of_note(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        response = client.get('/api/note/100/textblocks/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/note/1/textblocks/')
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/note/100/textblocks/', json.dumps({
            'content': 'test_content',
            'layer_x': 0,
            'layer_y': 0,
            'document_id': 'asfecsm3242a'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post('/api/note/1/textblocks/', json.dumps({
            'content': 'test_content',
            'layer_x': 0,
            'layer_y': 0,
            'document_id': 'asfecsm3242a'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = client.post('/api/note/1/textblocks/', json.dumps({
            'content': 'test_content',
            'layer_x': 3.333,
            'layer_y': 0,
            'document_id': 'asfecsm3242a'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_textblock_child_of_agenda(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        response = client.get('/api/agenda/100/textblocks/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/agenda/1/textblocks/')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/agenda/2/textblocks/')
        self.assertEqual(response.status_code, 404)

        response = client.post('/api/agenda/1/textblocks/', json.dumps({
            'content': 'test_content',
            'layer_x': 3.333,
            'layer_y': 0,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.post('/api/agenda/1/textblocks/', json.dumps({
            'content': 'test_content',
            'layer_x': 0,
            'layer_y': 0,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_modify_textblock(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        response = client.get('/api/textblock/100/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/textblock/1/')
        self.assertEqual(response.status_code, 200)

        response = client.patch('/api/textblock/1/', json.dumps({
            'content': 'test_content',
            'layer_x': 3.33,
            'layer_y': 0,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.patch('/api/textblock/1/', json.dumps({
            'content': 'test_content',
            'layer_x': 0,
            'layer_y': 0,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 202)

        response = client.delete('/api/textblock/1/')
        self.assertEqual(response.status_code, 200)

    def test_agenda_child_of_note(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        response = client.get('/api/note/2/agendas/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/note/1/agendas/')
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/note/100/agendas/', json.dumps({
            'content': 'test_content',
            'layer_x': 0,
            'layer_y': 0
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post('/api/note/1/agendas/', json.dumps({
            'content': 'test_content',
            'layer_x': 0,
            'layer_y': 0
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = client.post('/api/note/1/agendas/', json.dumps({
            'content': 'test_content',
            'layer_x': 3.333,
            'layer_y': 0
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_modify_agenda(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        response = client.get('/api/agenda/100/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/agenda/1/')
        self.assertEqual(response.status_code, 200)

        response = client.patch('/api/agenda/1/', json.dumps({
            'content': 'test_content',
            'layer_x': 3.33,
            'layer_y': 0,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.patch('/api/agenda/1/', json.dumps({
            'content': 'test_content',
            'layer_x': 0,
            'layer_y': 0,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 202)

        response = client.delete('/api/agenda/1/')
        self.assertEqual(response.status_code, 200)

    def test_todoblock_child_of_note(self):
        client = Client(enforce_csrf_checks=False)
        client.login(username='t@t.com', password="test")

        response = client.get('/api/note/2/todos/')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/note/1/todos/')
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/note/100/todos/', json.dumps({
            'content': 'test_content',
            'layer_x': 0,
            'layer_y': 0,
            'assignees': [1]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post('/api/note/1/todos/', json.dumps({
            'content': 'test_content',
            'layer_x': 0,
            'layer_y': 0,
            'assignees': [1]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = client.post('/api/note/1/todos/', json.dumps({
            'content': 'test_content',
            'layer_x': 3.333,
            'layer_y': 0,
            'assignees': [1]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)
