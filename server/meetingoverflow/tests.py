from django.test import TestCase, Client
import json
from django.contrib.auth.models import User
from .models import *

# Profile, Tag, Workspace, Note, Agenda, Calendar, File, Image, Table, Todo, TextBlock

class MOFTestCase(TestCase):

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
        self.assertEqual(str(Tag.objects.all().first()), "content: test_content")

        # Workspace Model Check
        workspace = Workspace(name="test_workspace")
        workspace.save()
        self.assertEqual(str(Workspace.objects.get(id=1)), "name: test_workspace")

        # Note Model Check
        note = Note(title="test_title", workspace=workspace)
        note.save()
        self.assertEqual(str(Note.objects.get(id=1)), "title: test_title")

        # Agenda Model Check
        agenda = Agenda(
            content="test_content",
            note=note,
        )
        agenda.save()
        self.assertEqual(str(Agenda.objects.get(id=1)), "note_id: 1")

        # Calendar Model Check
        calendar = Calendar(
            content="test_content",
            note=note
        )
        calendar.save()
        self.assertEqual(str(Calendar.objects.get(id=1)), "note_id: 1")

        # File Model Check
        file = File(
            content="test_content",
            note=note,
            url="abc"
        )
        file.save()
        self.assertEqual(str(File.objects.get(id=1)), "url: abc")

        # Image Model Check
        image = Image(
            note=note
        )
        image.save()
        self.assertEqual(str(Image.objects.get(id=1)), "note_id: 1")

        # Table Model Check
        table = Table(
            note=note,
            content="test_content"
        )
        table.save()
        self.assertEqual(str(Table.objects.get(id=1)), "note_id: 1")

        # Todo Model Check
        todo = Todo(
            note=note
        )
        todo.save()
        self.assertEqual(str(Todo.objects.get(id=1)), "note_id: 1")

        # TextBlock Model Check
        textblock = TextBlock(
            content="test_content",
            note=note
        )
        textblock.save()
        self.assertEqual(str(TextBlock.objects.get(id=1)), "content: test_content")


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
        
        response = client.post('/api/signin/', 
                                json.dumps({
                                    '1': 'test_name',
                                    '2': '1234'
                                }))
        self.assertEqual(response.status_code, 400)

        response = client.post('/api/signin/', 
                                json.dumps({
                                    'username': 'not_exist',
                                    'password': '1234'
                                }))
        self.assertEqual(response.status_code, 401)
        

