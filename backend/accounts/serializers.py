import phonenumbers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


def validate_saudi_phone(phone: str) -> str:
    try:
        parsed = phonenumbers.parse(phone, "SA")
        if not phonenumbers.is_valid_number(parsed):
            raise serializers.ValidationError("Enter a valid Saudi phone number.")
        return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
    except phonenumbers.NumberParseException:
        raise serializers.ValidationError("Enter a valid phone number.")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["phone", "full_name", "email", "role", "password", "password_confirm"]
        extra_kwargs = {
            "role": {"required": False},
            "email": {"required": False},
        }

    def validate_phone(self, value):
        return validate_saudi_phone(value)

    def validate_role(self, value):
        if value == "admin":
            raise serializers.ValidationError("Cannot register with admin role.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class HayyakTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["full_name"] = user.full_name
        token["role"] = user.role
        token["phone"] = user.phone
        token["is_phone_verified"] = user.is_phone_verified
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if user.is_suspended:
            raise serializers.ValidationError("Your account has been suspended.")
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "phone", "full_name", "email", "role", "is_phone_verified", "created_at"]
        read_only_fields = ["id", "phone", "role", "is_phone_verified", "created_at"]


class OTPVerifySerializer(serializers.Serializer):
    phone = serializers.CharField()
    otp_code = serializers.CharField(min_length=6, max_length=6)

    def validate_phone(self, value):
        return validate_saudi_phone(value)
