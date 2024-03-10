from rest_framework import serializers

from api.models import Game


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ["id", "timestamp_created"]