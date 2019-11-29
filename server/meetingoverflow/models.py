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

    def __str__(self):
        return f'name: {self.name}'


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
        return f'title: {self.title}, created at: {self.created_at}'


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

    """
    =============== Seeding ================
    Seeding 방법:
    python manage.py shell
    >> from meetingoverflow.models import *
    >> Agenda.seeding(시딩하고자 하는 갯수 입력) 
    ========================================
    """
    def seeding(seed_num):
        import random
        """
        =====================================
        만약 시딩하고자 하는 모델의 개수를 변경하고 싶다면
        이 부분에서 조정해주면 됨
        =====================================
        """
        NUM_OF_SEED_FOR_ACCOUNT = seed_num * 10
        NUM_OF_SEED_FOR_WORKSPACE = seed_num
        NUM_OF_SEED_FOR_NOTE = seed_num + 2
        NUM_OF_SEED_FOR_AGENDA = seed_num + 2
        NUM_OF_SEED_FOR_BLOCKS_IN_NOTE = seed_num + 1
        NUM_OF_SEED_FOR_BLOCKS_IN_AGENDA = seed_num

        """
        ======= User / Profile Seeding =======
        
        10명 단위로 맞춰둔 것, 되도록 변경하지 않을 것
        변경하고자 한다면 :
        아래의 Workspace 내부 admins와 members
        인덱싱도 함께 변경해줄 것
        ======================================
        """
        for i in range(1, NUM_OF_SEED_FOR_ACCOUNT + 1):
            username = f'{i}@{i}.com'
            password = '1234'

            User.objects.create_user(
                username=username,
                password=password,
            )
            # Profile
            user = User.objects.get(username=username)
            user.profile.nickname = f'user{i}'
            user.profile.save()

        """
        ========== Workspace Seeding =========
        각 workspace별로 admin은 Profile 
        10명 단위로 맨 앞의 2명을 지정해두었음. 
        멤버는 10명 단위로 전원을 지정
        ======================================
        """
        for i in range(1, NUM_OF_SEED_FOR_WORKSPACE + 1):
            name = f'workspace[{i}]'
            admins = Profile.objects.all()[10 * (i - 1): 10 * (i - 1) + 2]
            members = Profile.objects.all()[10 * (i - 1):]
            Workspace.objects.create(
                name=name
            )
            workspace = Workspace.objects.all().last()
            workspace.admins.set(admins)
            workspace.members.set(members)
            workspace.save()

            """
            ============= Note Seeding ============
            각 Note의 participants는 해당 Note가 속한
            Workspace의 모든 참여자로 지정해두었음. 
            =======================================
            """
            for j in range(1, NUM_OF_SEED_FOR_NOTE + 1):
                participants = members
                title = f'Note[{j}] inside workspace[{i}]'

                Note.objects.create(
                    workspace=workspace,
                    title=title
                )
                note = Note.objects.all().last()
                note.participants.set(participants)
                note.save()
                """
                ============ Blocks Seeding ============
                Note에 직접 속해있는 Block들 시딩한 부분
                추후 Calendar, File, Image, Table 의 
                구성 요소 추가할 필요가 있다면 이곳에 추가 바람
                ========================================
                """
                for k in range(1, NUM_OF_SEED_FOR_BLOCKS_IN_NOTE + 1):
                    Calendar.objects.create(
                        is_parent_note=True,
                        note=note
                    )

                    File.objects.create(
                        is_parent_note=True,
                        note=note
                    )

                    Image.objects.create(
                        is_parent_note=True,
                        note=note
                    )

                    Table.objects.create(
                        is_parent_note=True,
                        note=note
                    )

                    TextBlock.objects.create(
                        is_parent_note=True,
                        content=f"""
                                        random text content
                                        workspace: {i}
                                        note: {j}
                                        this: {k}
                                    """,
                        note=note
                    )

                    Todo.objects.create(
                        is_parent_note=True,
                        content=f"""
                                        random todo content 
                                        workspace: {i}
                                        note: {j}
                                        this: {k}
                                    """,
                        note=note
                    )
                    todo = Todo.objects.all().last()
                    todo.assignees.set(participants[:2])
                    todo.save()
                """
                ============ Agenda Seeding ============
                Note에 속해있는 Agenda들을 시딩한 부분
                아직 Agenda에 속해있는 Agenda는 시딩을 구현하지
                않은 상태이므로, 필요로 하는 경우가 있다면 
                이 부분에 구현 바람. 
                ========================================
                """
                for k in range(1, NUM_OF_SEED_FOR_AGENDA):
                    note = Note.objects.all().last()
                    containing_block_types = "calendar_file_image_table_todo_textblock"
                    Agenda.objects.create(
                        note=note,
                        containing_block_types=containing_block_types,
                        has_children=True,
                        content=f"""
                                    Agenda Contents
                                    workspace: {i}
                                    note: {j}
                                    this: {k}
                                """
                    )

                    """
                    ============ Blocks Seeding ============
                    Agenda에 속해있는 Block들 시딩한 부분
                    추후 Calendar, File, Image, Table 의 
                    구성 요소 추가할 필요가 있다면 이곳에 추가 바람
                    ========================================
                    """
                    for l in range(1, NUM_OF_SEED_FOR_BLOCKS_IN_AGENDA + 1):
                        parent_agenda = Agenda.objects.all().last()
                        Calendar.objects.create(
                            is_parent_note=False,
                            parent_agenda=parent_agenda,
                            note=note
                        )

                        File.objects.create(
                            is_parent_note=False,
                            parent_agenda=parent_agenda,
                            note=note
                        )

                        Image.objects.create(
                            is_parent_note=False,
                            parent_agenda=parent_agenda,
                            note=note
                        )

                        Table.objects.create(
                            is_parent_note=False,
                            parent_agenda=parent_agenda,
                            note=note
                        )

                        TextBlock.objects.create(
                            is_parent_note=False,
                            parent_agenda=parent_agenda,
                            content=f"""
                                        random text content 
                                        workspace: {i}
                                        note: {j}
                                        agenda: {k}
                                        this: {l}
                                    """,
                            note=note
                        )

                        Todo.objects.create(
                            is_parent_note=False,
                            parent_agenda=parent_agenda,
                            content=f"""
                                        random todo content 
                                        workspace: {i}
                                        note: {j}
                                        agenda: {k}
                                        this: {l}
                                    """,
                            note=note,
                        )
                        todo = Todo.objects.all().last()
                        todo.assignees.set(participants[:3])
                        todo.save()

    def __str__(self):
        return f'note_id: {self.note.id}'


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


class Todo(models.Model):
    content = models.TextField(null=False, blank=False)
    layer_x = models.IntegerField(default=0)
    layer_y = models.IntegerField(default=0)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    parent_agenda = models.ForeignKey(
        Agenda, on_delete=models.SET_NULL, null=True, blank=True)
    is_parent_note = models.BooleanField(default=True)
    assignees = models.ManyToManyField(Profile)
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, null=True, blank=True)
    is_done = models.BooleanField(default=False)

    def __str__(self):
        return f'note_id: {self.note.id}'


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
