from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
    class Meta:
        model = User
        # fields = '__all__'
        fields = ['username', 'password']

class SearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'


class WorkspaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = '__all__'


class AgendaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Agenda
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = '__all__'


class CalendarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Calendar
        fields = '__all__'


class FileSerializer(serializers.ModelSerializer):

    class Meta:
        model = File
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = '__all__'


class TableSerializer(serializers.ModelSerializer):

    class Meta:
        model = Table
        fields = '__all__'


class TodoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Todo
        fields = '__all__'


class TextBlockSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextBlock
        fields = '__all__'
