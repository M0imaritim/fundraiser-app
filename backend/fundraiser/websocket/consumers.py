import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class ContributorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("contributors_group", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("contributors_group", self.channel_name)

    async def receive(self, text_data):
        # Handle incoming (e.g., form submit ack)
        pass

    async def stats_update(self, event):
        await self.send(text_data=json.dumps({
            "type": event["type"],
            "data": event["data"]
        }))

    async def contributors_update(self, event):
        await self.send(text_data=json.dumps({
            "type": event["type"],
            "data": event["data"]
        }))

    async def withdrawal_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": event["type"],
            "data": event["data"]
        }))