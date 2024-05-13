from drf_spectacular.utils import extend_schema
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView

from games.models import Game
from games.serializers import GameSerializer


# Create your views here.
@extend_schema(tags=['game'])
class GameListApiView(ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


@extend_schema(tags=['game'])
class GameDetailApiView(RetrieveAPIView):
    lookup_field = 'code'
    serializer_class = GameSerializer
    queryset = Game.objects.all()
