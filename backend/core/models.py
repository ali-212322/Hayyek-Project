from django.db import models


class Neighborhood(models.Model):
    name_ar = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    city = models.CharField(max_length=100, default="Riyadh")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "neighborhoods"

    def __str__(self):
        return self.name_en