from django.db import models
from accounts.models import CustomUser


class Notification(models.Model):
    TYPE_CHOICES = [
        ("order", "Order"),
        ("payment", "Payment"),
        ("review", "Review"),
        ("system", "System"),
    ]

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="system")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.user.full_name}"