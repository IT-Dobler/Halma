from rest_framework.generics import RetrieveAPIView, ListAPIView

from api.models import Game
from api.serializers import GameSerializer


# Create your views here.


class GameListApiView(ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameDetailApiView(RetrieveAPIView):
    lookup_field = 'code'
    serializer_class = GameSerializer
    queryset = Game.objects.all()
