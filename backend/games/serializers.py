from rest_framework import serializers

from games.models import Game, Move, Turn


class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = ["move_number", "from_position", "to_position"]


class TurnSerializer(serializers.ModelSerializer):
    moves = MoveSerializer(many=True, required=False)

    class Meta:
        model = Turn
        fields = ['color', 'moves']


class GameSerializer(serializers.ModelSerializer):
    turns = TurnSerializer(many=True)

    class Meta:
        model = Game
        fields = ["code", "turns"]

    def create(self, validated_data):
        turn_data = validated_data.pop('turns')
        game = Game.objects.create(**validated_data)
        for turn in turn_data:
            game.turns.create(**turn)
        return game
