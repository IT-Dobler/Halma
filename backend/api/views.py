from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Game
from api.serializers import GameSerializer


# Create your views here.


class GameListApiView(APIView):
    def get(self, request, *args, **kwargs):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)