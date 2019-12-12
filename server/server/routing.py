from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import meetingoverflow.routing

ASGI_APPLICATION = "server.routing.application"
application = ProtocolTypeRouter(
    {
        # Empty for now (http->django views is added by default)
        "websocket": AuthMiddlewareStack(
            URLRouter(meetingoverflow.routing.websocket_urlpatterns)
        ),
    }
)
