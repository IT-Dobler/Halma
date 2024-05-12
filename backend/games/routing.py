from django.urls import path

from games import consumers

websocket_urlpatterns = [
    path('', consumers.ChatConsumer.as_asgi())
]
