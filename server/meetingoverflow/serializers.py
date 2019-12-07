from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

"""
We should fill in here
"""
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

"""
We should fill in here
"""
class EncapsulatedUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']

"""
We should fill in here
"""
class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'

"""
We should fill in here
"""
class WorkspaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace
        fields = '__all__'

"""
We should fill in here
"""
class NoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = '__all__'

"""
We should fill in here
"""
class AgendaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Agenda
        fields = '__all__'

"""
We should fill in here
"""
class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = '__all__'

"""
We should fill in here
"""
class CalendarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Calendar
        fields = '__all__'

"""
We should fill in here
"""
class FileSerializer(serializers.ModelSerializer):

    class Meta:
        model = File
        fields = '__all__'

"""
We should fill in here
"""
class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = '__all__'

"""
We should fill in here
"""
class TableSerializer(serializers.ModelSerializer):

    class Meta:
        model = Table
        fields = '__all__'

"""
We should fill in here
"""
class TodoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Todo
        fields = '__all__'

"""
We should fill in here
"""
class TextBlockSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextBlock
        fields = '__all__'
