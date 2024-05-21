from rest_framework import serializers

from games.models import Game, Move, Turn, Color


class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = ['move_number', 'from_position', 'to_position']


class TurnSerializer(serializers.ModelSerializer):
    moves = MoveSerializer(many=True, required=False)

    class Meta:
        model = Turn
        fields = ['color', 'moves']


class GameSerializer(serializers.ModelSerializer):
    turns = TurnSerializer(many=True, required=False)

    class Meta:
        model = Game
        fields = ['code', 'turns']

    def create(self, validated_data):
        turn_data = []

        if hasattr(validated_data, 'turns'):
            turn_data = validated_data.pop('turns')

        game = Game.objects.create(**validated_data)
        for turn in turn_data:
            game.turns.create(**turn)
        return game


class CreateGameResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['code']


class CreateGameRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['width', 'height', 'corner_size', 'max_players']


class JoinGameResponseSerializer(serializers.Serializer):
    color = serializers.ChoiceField(choices=Color.choices)
