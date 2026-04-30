from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

API_PREFIX = "api/v1/"

urlpatterns = [
    path("admin/", admin.site.urls),
    path(API_PREFIX + "auth/", include("accounts.urls")),
    path(API_PREFIX + "users/", include("accounts.user_urls")),
    path(API_PREFIX + "providers/", include("providers.urls")),
    path(API_PREFIX + "categories/", include("services.category_urls")),
    path(API_PREFIX + "services/", include("services.urls")),
    path(API_PREFIX + "orders/", include("orders.urls")),
    path(API_PREFIX + "payments/", include("payments.urls")),
    path(API_PREFIX + "reviews/", include("reviews.urls")),
    path(API_PREFIX + "notifications/", include("notifications.urls")),
    path(API_PREFIX + "admin/", include("core.admin_urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)