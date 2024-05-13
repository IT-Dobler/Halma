from django.urls import path

from games import consumers

websocket_urlpatterns = [
    path('ws/live-game/<str:game_code>', consumers.GameConsumer.as_asgi()),
]
