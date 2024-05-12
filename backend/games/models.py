from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Game(models.Model):
    id = models.UUIDField(primary_key=True)
    timestamp_created = models.DateTimeField(auto_now_add=True)
    timestamp_updated = models.DateTimeField(auto_now=True)
    code = models.TextField()
    players = models.ManyToManyField(User)


class Move(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="moves")
    move_number = models.IntegerField()
    from_position = models.CharField(max_length=5)
    to_position = models.CharField(max_length=5)
