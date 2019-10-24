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


class Workspace(models.Model):
    name = models.CharField(max_length=20, blank=True, null=True)
    # at least the creator of the workspace should exist as one of admins and also members
    admins = models.ForeignKey(Profile, related_name='workspace_admins', 
                                on_delete=models.CASCADE, null=False)
    members = models.ForeignKey(Profile, related_name='workspace_members', 
                                on_delete=models.CASCADE, null=False)
    notes = models.ManyToManyField(Note, on_delete=models.SET_NULL, null=True)
    def __str__(self):
        return f'name: {self.name}'


class Tag(models.Model):
    content = models.CharField(max_length=100, blank=False, null=False)


    def __str__(self):
        return f'content: {self.content}'

'''
Should modify the spec document
Note - Tag relationship into M:N
'''
class Note(models.Model):
    title = models.CharField(max_length=100, blank=True, null=False)
    # =================================================================
    # temporarily set null=True for convenience of testing and seeding
    # =================================================================
    participants = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    # added 'last_' before modified_at. 
    last_modified_at = models.DateTimeField(default=timezone.now)
    tags = models.ManyToManyField(Tag)
    ml_speech_text = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'title: {self.title}, created at: {self.created_at}'


class Agenda(models.Model):
    content = models.TextField(blank=True, default="안건과 관련된 회의 내용을 작성하는 부분입니다.")
    position_x = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    position_y = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    note_id = models.IntegerField()
    parent_agenda_id = models.IntegerField()
    is_parent_note = models.BooleanField(default=True)
    has_children = models.BooleanField(default=False)
    containing_block_types = models.CharField(blank=True, null=False) # ex) calendar_image_todo

    def __str__(self):
        return f'content: {self.content[:100]}'


class Calendar(models.Model):
    # content 정의를 어떻게 해야하는지?
    #content = models.
    position_x = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    position_y = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    note_id = models.IntegerField()
    parent_agenda_id = models.IntegerField()
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'note_id: {self.note_id}'


class File(models.Model):
    content = models.FileField(null=True)
    # FileField 사용하면 굳이 url을 저장해야하나 고민
    url = models.URLField(blank=True, null=True)
    position_x = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    position_y = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    note_id = models.IntegerField()
    parent_agenda_id = models.IntegerField()
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'url: {self.url}'


class Image(models.Model):
    content = models.ImageField(null=True)
    position_x = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    position_y = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    note_id = models.IntegerField()
    parent_agenda_id = models.IntegerField()
    is_parent_note = models.BooleanField(default=True)
    # image_caption = models.CharField(length=100, null=True, blank=True)

    def __str__(self):
        return f'note_id: {self.note_id}'


class Table(models.Model):
    # content = 
    position_x = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    position_y = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    note_id = models.IntegerField()
    parent_agenda_id = models.IntegerField()
    is_parent_note = models.BooleanField(default=True)

    def __str__(self):
        return f'note_id: {self.note_id}'


class Todo(models.Model):
    content = models.TextField(null=False, blank=False)
    position_x = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    position_y = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    note_id = models.IntegerField()
    parent_agenda_id = models.IntegerField()
    is_parent_note = models.BooleanField(default=True)
    assignees = models.ManyToManyField(Profile)

    def __str__(self):
        return f'content: {self.content}'


class TextBlock(models.Model):
    content = models.TextField(null=False, blank=True)
    position_x = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    position_y = models.DecimalField(default=0.0, max_digits=10, decimal_places=3)
    note_id = models.IntegerField()
    parent_agenda_id = models.IntegerField()
    is_parent_note = models.BooleanField(default=True)

    return f'content: {self.content[:100]}'