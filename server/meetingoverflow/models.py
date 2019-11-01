from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.utils import timezone


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # use username as default value?
    nickname = models.CharField(max_length=20, blank=True, null=True)
    # created_at = models.DateTimeField(default=timezone.now)
    # last_login_at = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return f'id: {self.user.id}, nickname: {self.nickname}'


    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)


    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()


class Tag(models.Model):
    content = models.CharField(max_length=100, blank=False, null=False)


    def __str__(self):
        return f'content: {self.content}'

class Workspace(models.Model):
    name = models.CharField(max_length=20, blank=True, null=True)
    # at least the creator of the workspace should exist as one of admins and also members
    admins = models.ManyToManyField(Profile, related_name='workspace_admins')
    members = models.ManyToManyField(Profile, related_name='workspace_members')


    # def seeding(seed_num):
    #     import random

    #     NUM_OF_SEED_FOR_ACCOUNT = seed_num * 10
    #     NUM_OF_SEED_FOR_WORKSPACE = seed_num

    #     for i in range(1, NUM_OF_SEED_FOR_ACCOUNT + 1):
    #         username = f'{i}@{i}.com'
    #         password = '1234'
            
    #         user = User.objects.create_user(
    #             username = username,
    #             password = password,
    #         )
    #         # Profile

    #         profile = Profile.objects.get(username=username)
    #         profile.nickname = f'user{i}'
    #         profile.save()
        
    #     for i in range(1, seed_num + 1):
    #         name = f'workspace_{i}'
    #         admins = Profile.objects.all()
    #         print(admins)
    #         members = Profile.objects.all()
    #         Workspace.objects.create(
    #             name=name
    #         )
    #         workspace = Workspace.objects.all().last()
    #         workspace.admins.set(admins)
    #         workspace.members.set(members)
    #         workspace.save()

    def __str__(self):
        return f'name: {self.name}'

'''
Should modify the spec document
Note - Tag relationship into M:N
'''
class Note(models.Model):
    title = models.CharField(max_length=100, blank=True, null=False)
    # =================================================================
    # temporarily set null=True for convenience of testing and seeding
    # =================================================================
    participants = models.ManyToManyField(Profile)
    created_at = models.DateTimeField(default=timezone.now)
    # added 'last_' before modified_at. 
    last_modified_at = models.DateTimeField(default=timezone.now)
    tags = models.ManyToManyField(Tag, blank=True)
    ml_speech_text = models.TextField(null=True, blank=True)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, null=True)


    # def seeding(seed_num):
    #     NUM_OF_SEED_FOR_NOTE = seed_num
    #     workspace_num = Workspace.objects.all().count()

    #     for i in range(1, NUM_OF_SEED_FOR_NOTE + 1):
    #         workspace = Workspace.objects.get(id=random.randrange(1, workspace_num))
    #         participants = Profile.objects.all()
    #         title = f'note_{i}'

    #         Note.objects.create(
    #             workspace=workspace,
    #             participants=participants,
    #             title=title
    #         )
            

    def __str__(self):
        return f'title: {self.title}, created at: {self.created_at}'


class Agenda(models.Model):
    content = models.TextField(blank=True, default="안건과 관련된 회의 내용을 작성하는 부분입니다.")
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)
    is_parent_note = models.BooleanField(default=True)
    has_children = models.BooleanField(default=False)
    containing_block_types = models.TextField(blank=True, null=False) # ex) calendar_image_todo
    is_done = models.BooleanField(default=False)

    # def seeding(seed_num):
    #     NUM_OF_SEED_FOR_AGENDA = seed_num
    #     NUM_OF_SEED_FOR_BLOCKS = seed_num + 1

    #     for i in range(1, NUM_OF_SEED_FOR_AGENDA):
    #         note = Note.objects.all().first()
    #         containing_block_types = "calendar_file_image_table_todo_textblock"
    #         Agenda.objects.create(
    #             note=note,
    #             containing_block_types=containing_block_types,
    #             has_children=True
    #         )
            
    #         for j in range(1, NUM_OF_SEED_FOR_BLOCKS + 1):
    #             parent_agenda = Agenda.objects.all().last()
    #             Calendar.objects.create(
    #                 is_parent_note=False,
    #                 parent_agenda=parent_agenda,
    #                 note=note
    #             )

    #             File.objects.create(
    #                 is_parent_note=False,
    #                 parent_agenda=parent_agenda,
    #                 note=note
    #             )

    #             Image.objects.create(
    #                 is_parent_note=False,
    #                 parent_agenda=parent_agenda,
    #                 note=note
    #             )

    #             Table.objects.create(
    #                 is_parent_note=False,
    #                 parent_agenda=parent_agenda,
    #                 note=note
    #             )

    #             TextBlock.objects.create(
    #                 is_parent_note=False,
    #                 parent_agenda=parent_agenda,
    #                 note=note
    #             )

    #             Todo.objects.create(
    #                 is_parent_note=False,
    #                 parent_agenda=parent_agenda,
    #                 note=note,
    #                 assignees = note.members
    #             )


    def __str__(self):
        return f'content: {self.content[:100]}'


class Calendar(models.Model):
    # content 정의를 어떻게 해야하는지?
    content = models.TextField(null=True, blank=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(Agenda, on_delete=models.SET_NULL, null=True)
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'note_id: {self.note_id}'


class File(models.Model):
    content = models.FileField(null=True)
    # FileField 사용하면 굳이 url을 저장해야하나 고민
    url = models.URLField(blank=True, null=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(Agenda, on_delete=models.SET_NULL, null=True)
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'url: {self.url}'


class Image(models.Model):
    content = models.ImageField(null=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(Agenda, on_delete=models.SET_NULL, null=True)
    is_parent_note = models.BooleanField(default=True)
    image_caption = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f'note_id: {self.note_id}'


class Table(models.Model):
    content = models.TextField(null=True, blank=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(Agenda, on_delete=models.SET_NULL, null=True)
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'note_id: {self.note_id}'


class Todo(models.Model):
    content = models.TextField(null=False, blank=False)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(Agenda, on_delete=models.SET_NULL, null=True)
    is_parent_note = models.BooleanField(default=True)
    assignees = models.ManyToManyField(Profile)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'content: {self.content}'


class TextBlock(models.Model):
    content = models.TextField(null=False, blank=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(Agenda, on_delete=models.SET_NULL, null=True)
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'content: {self.content[:100]}'