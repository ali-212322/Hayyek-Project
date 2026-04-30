from django.urls import re_path
from orders.consumers import OrderConsumer

websocket_urlpatterns = [
    re_path(r"ws/orders/(?P<order_id>\d+)/$", OrderConsumer.as_asgi()),
]