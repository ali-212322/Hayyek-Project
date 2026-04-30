from channels.generic.websocket import AsyncJsonWebsocketConsumer

class OrderConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return
        await self.accept()

    async def disconnect(self, code):
        pass
