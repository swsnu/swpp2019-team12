from django.urls import path
from .consumers import noteconsumer, agendaconsumer

websocket_urlpatterns = [
    path("ws/<int:note_id>/block/", noteconsumer.BlockConsumer),
    path("ws/<int:agenda_id>/agenda/block/", agendaconsumer.AgendaConsumer),
]
