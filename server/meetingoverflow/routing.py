from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/<int:note_id>/block/", consumers.BlockConsumer),
    path("ws/<int:agenda_id>/agenda/block/", consumers.AgendaConsumer),
]
