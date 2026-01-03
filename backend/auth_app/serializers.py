from rest_framework import serializers
from .models import User



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

