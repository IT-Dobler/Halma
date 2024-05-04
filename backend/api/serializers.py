from rest_framework import serializers

from api.models import Game, Move


class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = ["move_number", "from_position", "to_position"]


class GameSerializer(serializers.ModelSerializer):
    moves = MoveSerializer(many=True)

    class Meta:
        model = Game
        fields = ["id", "timestamp_created", "timestamp_updated", "code", "players", "moves"]
