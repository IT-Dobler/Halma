import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from games.models import Move, Turn, Game


class GameConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_group_name = None
        self.room_name = None

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["game_code"]
        self.room_group_name = f"game_{self.room_name}"

        print('Connected!')

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
        pass

    # Receive message from Game group
    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        color_data = text_data_json.pop('color')

        # Find the game
        game = Game.objects.get(code=self.room_name)

        # Based on the game and the color, find or create the turn
        # TODO Obviously needs enhancement to multiple turns
        turn, created = Turn.objects.get_or_create(game=game, color=color_data)

        # Combine to create the move
        Move.objects.create(turn=turn, **text_data_json)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "move", "move": json.dumps(text_data_json)}
        )

    # Send message to participants of the room
    def move(self, event):  # The name of this method is based on the "type" variable above :o
        move = event["move"]

        self.send(text_data=json.dumps(move))
