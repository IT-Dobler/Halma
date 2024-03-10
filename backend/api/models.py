from django.db import models


# Create your models here.

class Game(models.Model):
    id = models.UUIDField(primary_key=True)
    timestamp_created = models.DateTimeField(auto_now_add=True)
