from django.urls import path
from .views import ReviewListView, ReviewCreateView, ReviewReplyView

urlpatterns = [
    path("", ReviewListView.as_view(), name="review-list"),
    path("create/", ReviewCreateView.as_view(), name="review-create"),
    path("<int:pk>/reply/", ReviewReplyView.as_view(), name="review-reply"),
]