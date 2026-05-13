from django.urls import path
from .views import ServiceCategoryListView

urlpatterns = [
    path("", ServiceCategoryListView.as_view(), name="category-list"),
]