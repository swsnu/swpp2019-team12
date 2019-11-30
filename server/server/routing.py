from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import meetingoverflow.routing

application = ProtocolTypeRouter({
    # we will come back later
    "websocket": AuthMiddlewareStack(
        URLRouter(
            meetingoverflow.routing.websocket_urlpatterns
        )
    )
})
