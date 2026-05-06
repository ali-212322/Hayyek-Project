import random
import string
from datetime import timedelta
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required.")
        extra_fields.setdefault("is_active", True)
        user = self.model(phone=phone, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")
        extra_fields.setdefault("is_phone_verified", True)
        return self.create_user(phone, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("resident", "Resident"),
        ("provider", "Provider"),
        ("admin", "Admin"),
    ]
    phone = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="resident")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.full_name} ({self.phone})"


class OTPVerification(models.Model):
    PURPOSE_CHOICES = [
        ("register", "Registration"),
        ("login", "Login"),
        ("reset", "Password Reset"),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="otps")
    otp_code = models.CharField(max_length=10)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES, default="register")
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "otp_verifications"

    @classmethod
    def generate_code(cls, length=6):
        return "".join(random.choices(string.digits, k=length))

    @classmethod
    def create_for_user(cls, user, purpose="register", expiry_minutes=10):
        cls.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)
        code = cls.generate_code()
        otp = cls.objects.create(
            user=user,
            otp_code=code,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=expiry_minutes),
        )
        return otp

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def verify(self, code):
        if self.is_used:
            return False, "OTP already used."
        if self.is_expired:
            return False, "OTP has expired."
        if self.otp_code != code:
            return False, "Invalid OTP."
        self.is_used = True
        self.save(update_fields=["is_used"])
        return True, "OTP verified."
