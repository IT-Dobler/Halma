from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from api.views import GameListApiView

urlpatterns = [
    path('games/', GameListApiView.as_view())
]

# Makes it so that the suffix of the url doesn't interfere.
urlpatterns = format_suffix_patterns(urlpatterns)
