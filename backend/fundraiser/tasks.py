from celery import shared_task
from .services.mpesa import MpesaClient
from .models import Contributor
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

mpesa = MpesaClient()

@shared_task
def check_balance_and_notify():
    total_paid = Contributor.objects.filter(paid=True).aggregate(Sum('amount'))['amount__sum'] or 0
    balance = mpesa.check_balance()
    if balance < total_paid:
        diff = total_paid - balance
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "contributors_group",
            {
                "type": "withdrawal_notification",
                "data": {"amount": diff, "message": f"Withdrawal detected: KES {diff:.2f}"}
            }
        )