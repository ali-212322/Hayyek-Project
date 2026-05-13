from django.db import models
from accounts.models import CustomUser
from providers.models import ProviderProfile
from orders.models import Order


class Review(models.Model):
    resident = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    provider = models.ForeignKey(
        ProviderProfile,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="review",
    )
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True)
    provider_reply = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "reviews"

    def __str__(self):
        return f"Review by {self.resident.full_name} for {self.provider.business_name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update provider avg rating
        from django.db.models import Avg
        avg = Review.objects.filter(provider=self.provider).aggregate(Avg("rating"))["rating__avg"]
        self.provider.avg_rating = avg or 0
        self.provider.save(update_fields=["avg_rating"])