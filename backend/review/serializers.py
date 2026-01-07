from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from rest_framework.validators import ValidationError
from .models import Review, ReviewMedia
from review.models import ReviewReply


# =========================================================
# REVIEW MEDIA
# =========================================================

class ReviewMediaSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ReviewMedia
        fields = (
            "id",
            "media_type",
            "url",
        )

    def get_url(self, obj):
        request = self.context.get("request")
        if obj.file:
            return (
                request.build_absolute_uri(obj.file.url)
                if request
                else obj.file.url
            )
        return None


# =========================================================
# REVIEW REPLY (INLINE – PUBLIC)
# =========================================================

class ReviewReplyInlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewReply
        fields = (
            "id",
            "body",
            "created_at",
            "updated_at",
        )


# =========================================================
# REVIEW (PUBLIC)
# =========================================================

class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.CharField(
        source="author_name",
        read_only=True,
    )

    author_profile_image_url = serializers.SerializerMethodField()
    reply = ReviewReplyInlineSerializer(read_only=True)
    media = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            "id",
            "rating",
            "title",
            "body",
            "author",
            "author_profile_image_url",
            "media",
            "created_at",
            "reply",
        )

    def get_author_profile_image_url(self, obj):
        request = self.context.get("request")
        user = obj.user

        if user and getattr(user, "profile_image", None):
            return (
                request.build_absolute_uri(user.profile_image.url)
                if request
                else user.profile_image.url
            )
        return None

    def get_media(self, obj):
        """
        Ensures absolute URLs even for nested serializers
        """
        request = self.context.get("request")
        serializer = ReviewMediaSerializer(
            obj.media.all(),
            many=True,
            context={"request": request},
        )
        return serializer.data


# =========================================================
# REVIEW CREATE
# =========================================================

class ReviewCreateSerializer(serializers.ModelSerializer):
    """
    Review creation serializer.
    Target object (content_object) is injected by the view.
    """

    class Meta:
        model = Review
        fields = (
            "rating",
            "title",
            "body",
        )

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )
        return value


# =========================================================
# REVIEW REPLY (DETAILED / DASHBOARD)
# =========================================================

class ReviewReplySerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()
    company_logo_url = serializers.SerializerMethodField()

    class Meta:
        model = ReviewReply
        fields = (
            "id",
            "body",
            "company_name",
            "company_logo_url",
            "created_at",
            "updated_at",
        )

    def get_company(self, obj):
        return getattr(obj.review, "content_object", None)

    def get_company_name(self, obj):
        company = self.get_company(obj)
        return company.name if company else None

    def get_company_logo_url(self, obj):
        request = self.context.get("request")
        company = self.get_company(obj)

        if company and company.logo:
            return (
                request.build_absolute_uri(company.logo.url)
                if request
                else company.logo.url
            )
        return None


# =========================================================
# REVIEW REPLY CREATE
# =========================================================

class ReviewReplyCreateSerializer(serializers.ModelSerializer):
    """
    Used by company owner/manager to create or update a reply
    """

    class Meta:
        model = ReviewReply
        fields = ("body",)

    def validate(self, attrs):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError(
                "Authentication required."
            )

        return attrs


# =========================================================
# REVIEW DASHBOARD (ADMIN / OWNER)
# =========================================================

class ReviewDashboardSerializer(serializers.ModelSerializer):
    reply = ReviewReplySerializer(read_only=True)
    media = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "rating",
            "title",
            "body",
            "author_name",
            "author_email",
            "is_verified",
            "moderation_status",
            "media",
            "created_at",
            "reply",
        ]

    def get_media(self, obj):
        request = self.context.get("request")
        serializer = ReviewMediaSerializer(
            obj.media.all(),
            many=True,
            context={"request": request},
        )
        return serializer.data


# =========================================================
# REVIEW MEDIA UPLOAD
# =========================================================

class ReviewMediaUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewMedia
        fields = ("file",)

    def validate_file(self, file):
        """
        Validate file exists and determine media type
        """
        name = file.name.lower()

        if name.endswith(("jpg", "jpeg", "png", "webp")):
            self.media_type = "image"
        elif name.endswith(("mp4", "mov", "webm")):
            self.media_type = "video"
        else:
            raise ValidationError("Unsupported media format")

        return file

    def create(self, validated_data):
        review = self.context.get("review")
        if not review:
            raise ValidationError("Review context is required")

        file = validated_data["file"]

        return ReviewMedia.objects.create(
            review=review,
            file=file,
            media_type=self.media_type,
        )