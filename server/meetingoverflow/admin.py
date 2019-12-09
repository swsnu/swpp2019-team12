from django.contrib import admin
from .models import (Profile, Workspace, Note, Tag, Agenda,
                     Calendar, File, Image, Table, Todo, TextBlock)

# Register your models here.
admin.site.register(Profile)
admin.site.register(Workspace)
admin.site.register(Note)
admin.site.register(Tag)
admin.site.register(Agenda)
admin.site.register(Calendar)
admin.site.register(File)
admin.site.register(Image)
admin.site.register(Table)
admin.site.register(Todo)
admin.site.register(TextBlock)
