from django.urls import path
from . import views

urlpatterns = [
    path('contributions/', views.ContributionView.as_view(), name='contributions'),
    path('stats/', views.StatsView.as_view(), name='stats'),
    path('contributors/', views.ContributorsView.as_view(), name='contributors'),
    path('mpesa/callback/', views.MpesaCallbackView.as_view(), name='mpesa_callback'),
]