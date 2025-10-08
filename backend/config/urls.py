# config/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('fundraiser.urls')),
    path('health', lambda request: HttpResponse('OK'), name='health'),
]

# ASGI for WebSockets
application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter([
            path('ws/contributors/', include('fundraiser.websocket.routing')),
        ])
    ),
})