from django.urls import path

from . import consumers

websocket_urlpatterns = [path("ws/<int:note_id>/agenda/", consumers.AgendaConsumer)]

