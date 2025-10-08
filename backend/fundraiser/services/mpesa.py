import requests
import base64
import json
from datetime import datetime
from decouple import config
# from .config/settings import MPESA_BASE_URL, MPESA_SHORTCODE, etc.  # Or import from settings

class MpesaClient:
    def __init__(self):
        self.base_url = config('MPESA_BASE_URL', default='https://sandbox.safaricom.co.ke')
        self.consumer_key = config('MPESA_CONSUMER_KEY')
        self.consumer_secret = config('MPESA_CONSUMER_SECRET')
        self.shortcode = config('MPESA_SHORTCODE')
        self.passkey = config('MPESA_PASSKEY')

    def get_access_token(self):
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        auth = base64.b64encode(f"{self.consumer_key}:{self.consumer_secret}".encode()).decode()
        headers = {"Authorization": f"Basic {auth}"}
        response = requests.get(url, headers=headers)
        return response.json().get('access_token')

    def stk_push(self, phone, amount, callback_url):
        token = self.get_access_token()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = base64.b64encode(f"{self.shortcode}{self.passkey}{timestamp}".encode()).decode()
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": str(amount),
            "PartyA": phone,
            "PartyB": self.shortcode,
            "PhoneNumber": phone,
            "CallBackURL": callback_url,
            "AccountReference": "KCPE Reunion",
            "TransactionDesc": "Fundraiser Contribution",
        }
        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(url, json=payload, headers=headers)
        return response.json()

    def check_balance(self):
        token = self.get_access_token()
        # Similar to Rust; use AccountBalance query
        initiator = config('MPESA_INITIATOR')  # Add to env
        credential = config('MPESA_CREDENTIAL')  # Add to env
        payload = {  # ... full payload as in Rust
            "InitiatorName": initiator,
            "SecurityCredential": credential,
            "CommandID": "AccountBalance",
            # ... other fields
        }
        url = f"{self.base_url}/mpesa/accountbalance/v1/query"
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()
        # Parse balance from data['responseDescription'] or similar
        return float(data.get('balance', 0))  # Placeholder parse