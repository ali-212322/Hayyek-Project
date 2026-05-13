from django.db import models
from accounts.models import CustomUser


class ProviderProfile(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("suspended", "Suspended"),
    ]

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="provider_profile",
    )
    business_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    neighborhood = models.ForeignKey(
        "core.Neighborhood",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    logo = models.ImageField(upload_to="providers/logos/", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    is_available = models.BooleanField(default=True)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_orders = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "provider_profiles"

    def __str__(self):
        return f"{self.business_name} ({self.user.phone})"