from django.db.models import F
from django.utils.crypto import get_random_string
from drf_spectacular.utils import extend_schema
from rest_framework import status, mixins
from rest_framework.generics import ListCreateAPIView, GenericAPIView
from rest_framework.response import Response

from games.models import Game, Color
from games.serializers import GameSerializer, CreateGameRequestSerializer, CreateGameResponseSerializer, \
    JoinGameResponseSerializer


# Create your views here.
@extend_schema(tags=['game'])
class GameListApiView(ListCreateAPIView):
    queryset = Game.objects.all()

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            return CreateGameRequestSerializer
        return GameSerializer

    @extend_schema(request=CreateGameRequestSerializer, responses=CreateGameResponseSerializer)
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = CreateGameRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Add a generated game code
        game_code = get_random_string(length=8)
        saved = serializer.save(code=game_code)

        serializer = CreateGameResponseSerializer(instance=saved)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@extend_schema(tags=['game'])
class GameDetailApiView(mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        GenericAPIView):
    lookup_field = 'code'
    serializer_class = GameSerializer
    queryset = Game.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @extend_schema(operation_id="joinGame", request=None, responses=JoinGameResponseSerializer)
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        code = kwargs['code']

        # Fetch game from code
        game = Game.objects.get(code=code)

        # If the game is full
        if game.player_count >= game.max_players:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        print(game.player_count)

        # Otherwise respond with the game state and assigned color
        next_color = Color.choices[game.player_count]
        print(game.player_count)
        game.player_count = F('player_count') + 1
        print(game.player_count)
        game.save()

        # TODO somewhere here we should link up users to the game

        return Response({'color': next_color[0]})
