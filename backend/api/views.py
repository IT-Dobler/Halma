from drf_spectacular.utils import extend_schema
from rest_framework.generics import RetrieveAPIView, ListAPIView

from api.models import Game
from api.serializers import GameSerializer


# Create your views here.

@extend_schema(tags=['game'])
class GameListApiView(ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


@extend_schema(tags=['game'])
class GameDetailApiView(RetrieveAPIView):
    lookup_field = 'code'
    serializer_class = GameSerializer
    queryset = Game.objects.all()
