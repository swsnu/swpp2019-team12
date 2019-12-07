from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.utils import timezone


"""
We should fill in here
"""
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


"""
We should fill in here
"""
class Tag(models.Model):
    content = models.CharField(max_length=100, blank=False, null=False)

    def __str__(self):
        return f'content: {self.content}'


"""
We should fill in here
"""
class Workspace(models.Model):
    name = models.CharField(max_length=20, blank=True, null=True)
    # at least the creator of the workspace should exist as one of admins and also members
    admins = models.ManyToManyField(Profile, related_name='workspace_admins')
    members = models.ManyToManyField(Profile, related_name='workspace_members')

    def __str__(self):
        return f'name: {self.name}'


"""
We should fill in here
"""
class Note(models.Model):
    title = models.CharField(max_length=100, blank=True, null=False)
    # =================================================================
    # temporarily set null=True for convenience of testing and seeding
    # =================================================================
    location = models.CharField(max_length=100, blank=True)
    participants = models.ManyToManyField(Profile)
    created_at = models.DateTimeField(default=timezone.now)
    # added 'last_' before modified_at.
    last_modified_at = models.DateTimeField(default=timezone.now)
    tags = models.ManyToManyField(Tag, blank=True)
    ml_speech_text = models.TextField(null=True, blank=True)
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'title: {self.title}'


"""
We should fill in here
"""
class Agenda(models.Model):
    content = models.TextField(
        blank=True, default="안건과 관련된 회의 내용을 작성하는 부분입니다.")
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True)
    is_parent_note = models.BooleanField(default=True)
    # has_children = models.BooleanField(default=False)
    # containing_block_types = models.TextField(blank=True, null=False) # ex) calendar_image_todo
    is_done = models.BooleanField(default=False)
    has_text_block = models.BooleanField(default=False)
    has_image_block = models.BooleanField(default=False)
    has_calendar_block = models.BooleanField(default=False)
    has_table_block = models.BooleanField(default=False)
    has_todo_block = models.BooleanField(default=False)
    has_file_block = models.BooleanField(default=False)
    has_agenda_block = models.BooleanField(default=False)
    children_blocks = models.TextField(null=True, blank=True)


    def __str__(self):
        return f'note_id: {self.note.id}'


"""
We should fill in here
"""
class Calendar(models.Model):
    # content 정의를 어떻게 해야하는지?
    content = models.TextField(null=True, blank=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(
        Agenda, on_delete=models.SET_NULL, null=True, blank=True)
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'note_id: {self.note_id}'


"""
We should fill in here
"""
class File(models.Model):
    content = models.FileField(null=True)
    # FileField 사용하면 굳이 url을 저장해야하나 고민
    url = models.URLField(blank=True, null=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(
        Agenda, on_delete=models.SET_NULL, null=True, blank=True)
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'url: {self.url}'


"""
We should fill in here
"""
class Image(models.Model):
    content = models.ImageField(null=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(
        Agenda, on_delete=models.SET_NULL, null=True, blank=True)
    is_parent_note = models.BooleanField(default=True)
    image_caption = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f'note_id: {self.note_id}'


"""
We should fill in here
"""
class Table(models.Model):
    content = models.TextField(null=True, blank=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(
        Agenda, on_delete=models.SET_NULL, null=True, blank=True)
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'note_id: {self.note_id}'


"""
We should fill in here
"""
class Todo(models.Model):
    content = models.TextField(null=False, blank=False)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(
        Agenda, on_delete=models.SET_NULL, null=True, blank=True)
    is_parent_note = models.BooleanField(default=True)
    assignees = models.ManyToManyField(Profile, blank=True)
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, null=True, blank=True)
    is_done = models.BooleanField(default=False)
    due_date = models.DateField(default=timezone.now().strftime("%Y-%m-%d"))
    # due = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'note_id: {self.note.id}'


"""
We should fill in here
"""
class TextBlock(models.Model):
    content = models.TextField(null=False, blank=True)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    document_id = models.CharField(max_length=100, null=True, blank=True)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(
        Agenda, on_delete=models.SET_NULL, null=True, blank=True)
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        # return f'note_id: {self.note.id}'
        return f'content: {self.content}'
