from django.urls import path

from api import consumers

websocket_urlpatterns = [
    path('', consumers.ChatConsumer.as_asgi())
]
