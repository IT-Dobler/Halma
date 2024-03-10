"""
ASGI config for Halma project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import api.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Halma.settings')

asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
   "http": asgi_application,
   "websocket": URLRouter(api.routing.websocket_urlpatterns)
})
