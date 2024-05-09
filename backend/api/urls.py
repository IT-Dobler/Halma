from django.urls import path
from drf_spectacular.views import SpectacularAPIView
from rest_framework.urlpatterns import format_suffix_patterns

from api.views import GameListApiView, GameDetailApiView

urlpatterns = [
    path('games/', GameListApiView.as_view()),
    path('games/<str:code>/', GameDetailApiView.as_view()),
    path('schema/', SpectacularAPIView.as_view())
]

# Makes it so that the suffix of the url doesn't interfere.
urlpatterns = format_suffix_patterns(urlpatterns)
