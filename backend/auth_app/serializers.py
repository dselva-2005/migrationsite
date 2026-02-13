# auth_app/serializers.py
from rest_framework import serializers
from .models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "profile_image",
            "mobile_number",
            "profile_image_url",
            "date_joined",
        )
        read_only_fields = ("id", "email", "date_joined")

    def get_profile_image_url(self, obj):
        request = self.context.get("request")
        if obj.profile_image and request:
            return request.build_absolute_uri(obj.profile_image.url)
        return None

    def validate_username(self, value):
        user = self.context["request"].user

        if (
            User.objects
            .exclude(id=user.id)
            .filter(username=value)
            .exists()
        ):
            raise serializers.ValidationError("Username already taken")

        return value

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("email", "username", "password")

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
        )


User = get_user_model()


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


def decode_uid(uidb64):
    try:
        # decode bytes to string, then convert to int
        uid_bytes = urlsafe_base64_decode(uidb64)
        uid_str = uid_bytes.decode()  # bytes -> str
        return int(uid_str)
    except Exception:
        return None


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(min_length=8)

    def validate(self, attrs):
        uid = decode_uid(attrs["uid"])
        if uid is None:
            raise serializers.ValidationError("Invalid reset link")

        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid reset link")

        token = attrs["token"]
        if not PasswordResetTokenGenerator().check_token(user, token):
            raise serializers.ValidationError("Invalid or expired token")

        attrs["user"] = user
        return attrs