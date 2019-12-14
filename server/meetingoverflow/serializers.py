from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    User,
    Profile,
    Workspace,
    Note,
    Tag,
    Image,
    Calendar,
    File,
    Agenda,
    Table,
    TextBlock,
    Todo,
)


class UserSerializer(serializers.ModelSerializer):
    """
    Serialize User model
    """

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    class Meta:
        model = User
        fields = ["username", "password"]


class EncapsulatedUserSerializer(serializers.ModelSerializer):
    """
    Serialize User model without password
    """

    class Meta:
        model = User
        fields = ["id", "username"]


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serialize Profile model
    """

    class Meta:
        model = Profile
        fields = "__all__"


class WorkspaceSerializer(serializers.ModelSerializer):
    """
    Serialize Workspace model
    """

    class Meta:
        model = Workspace
        fields = "__all__"


class NoteSerializer(serializers.ModelSerializer):
    """
    Serialize Note model
    """

    class Meta:
        model = Note
        fields = "__all__"


class AgendaSerializer(serializers.ModelSerializer):
    """
    Serialize Agenda model
    """

    class Meta:
        model = Agenda
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    """
    Serialize Tag model
    """

    class Meta:
        model = Tag
        fields = "__all__"


class CalendarSerializer(serializers.ModelSerializer):
    """
    Serialize Calendar model
    """

    class Meta:
        model = Calendar
        fields = "__all__"


class FileSerializer(serializers.ModelSerializer):
    """
    Serialize File model
    """

    class Meta:
        model = File
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer):
    """
    Serialize Image model
    """

    # image = serializers.ImageField(use_url=True)

    class Meta:
        model = Image
        fields = "__all__"


class TableSerializer(serializers.ModelSerializer):
    """
    Serialize Table model
    """

    class Meta:
        model = Table
        fields = "__all__"


class TodoSerializer(serializers.ModelSerializer):
    """
    Serialize Todo model
    """

    class Meta:
        model = Todo
        fields = "__all__"


class TextBlockSerializer(serializers.ModelSerializer):
    """
    Serialize TextBlock model
    """

    class Meta:
        model = TextBlock
        fields = "__all__"
