from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Contributor, Stats, YearlyContributors
from .serializers import ContributorSerializer  # Define below
from .services.mpesa import MpesaClient
import channels.layers
from asgiref.sync import async_to_sync
from uuid import uuid4

mpesa = MpesaClient()

class HealthView(APIView):
    def get(self, request):
        return Response({"status": "OK"})

class ContributionView(APIView):
    def post(self, request):
        serializer = ContributorSerializer(data=request.data)
        if serializer.is_valid():
            contrib = serializer.save(paid=False)
            stk_response = mpesa.stk_push(
                request.data['phone'],
                float(request.data['amount']),
                config('CALLBACK_URL')
            )
            if stk_response.get('ResponseCode') != '0':
                return Response({"error": stk_response.get('errorMessage')}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StatsView(APIView):
    def get(self, request):
        paid_contribs = Contributor.objects.filter(paid=True)
        total_raised = paid_contribs.aggregate(Sum('amount'))['amount__sum'] or 0
        total_contributors = paid_contribs.count()
        percentage = (total_raised / 500000) * 100
        stats = Stats(total_raised, total_contributors, percentage=percentage)
        
        # Broadcast via WebSocket
        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "contributors_group",
            {"type": "stats_update", "data": stats.__dict__}
        )
        return Response(stats.__dict__)

class ContributorsView(APIView):
    def get(self, request):
        yearly = Contributor.objects.filter(paid=True).values('kcpe_year').annotate(
            contributors=ArrayAgg('name')
        ).order_by('kcpe_year')
        result = [{"year": item['kcpe_year'], "contributors": item['contributors']} for item in yearly]
        
        # Broadcast
        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "contributors_group",
            {"type": "contributors_update", "data": result}
        )
        return Response(result)

class MpesaCallbackView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        if data.get('Body', {}).get('stkCallback', {}).get('ResultCode') == 0:
            # Parse callback metadata
            metadata = data['Body']['stkCallback']['CallbackMetadata']
            amount = next((item['Value'] for item in metadata if item['Name'] == 'Amount'), 0)
            # Extract phone from ReceiptNumber or similar
            phone = "extract_from_metadata"  # Implement parsing
            try:
                contrib = Contributor.objects.filter(phone=phone, amount=amount, paid=False).first()
                if contrib:
                    contrib.paid = True
                    contrib.save()
                    # Broadcast updates
                    # Call stats and contributors broadcast (or trigger Celery)
            except Exception as e:
                print(f"Callback error: {e}")
        return Response({"ResultCode": 0, "ResultDesc": "Accepted"}, status=status.HTTP_200_OK)