import uuid

from django.contrib.auth.models import User
from django.db import models


# Create your models here.

class AbstractUUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    timestamp_created = models.DateTimeField(auto_now_add=True)
    timestamp_updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Game(AbstractUUIDModel):
    code = models.TextField()
    players = models.ManyToManyField(User)
    width = models.IntegerField()
    height = models.IntegerField()
    corner_size = models.IntegerField()
    player_count = models.IntegerField(default=0)
    max_players = models.IntegerField()


class Color(models.TextChoices):
    YELLOW = 'Y'
    RED = 'R'
    BLUE = 'B'
    GREEN = 'G'


class Turn(AbstractUUIDModel):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="games")
    color = models.CharField(max_length=1, choices=Color.choices)


class Move(AbstractUUIDModel):
    turn = models.ForeignKey(Turn, on_delete=models.CASCADE, related_name="turns")
    move_number = models.IntegerField()
    from_position = models.CharField(max_length=5)
    to_position = models.CharField(max_length=5)

    # TODO remove when game instances are created dynamically
    # class Meta:
    #    constraints = [
    #        models.UniqueConstraint(fields=['move_number', 'turn'], name='unique move number per turn')
    #    ]
