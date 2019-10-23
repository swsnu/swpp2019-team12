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
    # CASCADE or SET_NULL
    #notes = models.ForeignKey(Note, on_delete=models.SET_NULL, null=True)
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


