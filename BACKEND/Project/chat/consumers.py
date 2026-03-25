
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import ChatMessage
from appointment.models import Appointment
from api.models import Doctor

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.class_id = self.scope['url_route']['kwargs']['class_id']
        self.group_name = f"class_{self.class_id}"

        # Check if the user is authenticated and allowed to join the chat.
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        # Optionally send recent chat history (e.g., last 50 messages)
        await self.send_chat_history()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"error": "Invalid JSON received"}))
            return

        message = data.get("message", "")
        user = self.scope["user"]

        # Save the message to the database
        chat_message = await self.save_message(user, self.class_id, message)

        # Broadcast the message to the group
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": user.username,
                "timestamp": chat_message.timestamp.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "username": event["username"],
            "timestamp": event["timestamp"],
        }))

    async def send_chat_history(self):
        messages = await self.get_chat_history(self.class_id)
        # Build a simple list of messages; you can use a serializer if desired.
        history = []
        for msg in messages:
            history.append({
                "username": msg.sender.username,
                "message": msg.content,
                "timestamp": msg.timestamp.isoformat(),
            })
        await self.send(text_data=json.dumps({"history": history}))

    @database_sync_to_async
    def save_message(self, user, class_id, message):
        appt  = Appointment.objects.get(pk=class_id)
        return ChatMessage.objects.create(
            appointment_obj=appt,
            sender=user,
            content=message
        )

    @database_sync_to_async
    def get_chat_history(self, class_id):
        # Return the last 50 messages in chronological order with sender pre-fetched.
        return list(
            ChatMessage.objects.filter(appointment_obj_id=class_id)
            .select_related("sender")
            .order_by("timestamp")[:50]
        )
