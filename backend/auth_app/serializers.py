# auth_app/serializers.py
from rest_framework import serializers
from .models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from django.contrib.auth import get_user_model


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


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(min_length=8)

    def validate(self, attrs):
        try:
            uid = urlsafe_base64_decode(attrs["uid"]).decode()
            user = User.objects.get(id=uid)
        except Exception:
            raise serializers.ValidationError("Invalid reset link")

        token = attrs["token"]
        if not PasswordResetTokenGenerator().check_token(user, token):
            raise serializers.ValidationError("Invalid or expired token")

        attrs["user"] = user
        return attrs
