from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from games.views import GameListApiView, GameDetailApiView

urlpatterns = [
    path('', GameListApiView.as_view()),
    path('<str:code>/', GameDetailApiView.as_view()),
]

# Makes it so that the suffix of the url doesn't interfere.
urlpatterns = format_suffix_patterns(urlpatterns)
