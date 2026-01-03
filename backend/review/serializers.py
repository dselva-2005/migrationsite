from rest_framework import serializers
from .models import Review
from django.contrib.contenttypes.models import ContentType
from review.models import ReviewReply


# =========================================================
# BULK ACTIONS
# =========================================================

class ReviewBulkActionSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )
    action = serializers.ChoiceField(
        choices=["approve", "reject"]
    )


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
        read_only=True
    )

    author_profile_image_url = serializers.SerializerMethodField()
    reply = ReviewReplyInlineSerializer(read_only=True)

    class Meta:
        model = Review
        fields = (
            "id",
            "rating",
            "title",
            "body",
            "author",
            "author_profile_image_url",
            "created_at",
            "reply",
        )

    def get_author_profile_image_url(self, obj):
        request = self.context.get("request")
        user = obj.user

        if user and user.profile_image:
            url = user.profile_image.url
            return request.build_absolute_uri(url) if request else url

        return None


# =========================================================
# REVIEW CREATE
# =========================================================

class ReviewCreateSerializer(serializers.ModelSerializer):
    """
    Review creation serializer.
    Target object (content_object) is injected by the view.
    Author info is derived from request.user.
    """

    class Meta:
        model = Review
        fields = (
            "rating",
            "title",
            "body",
        )

    def validate_rating(self, value):
        if not (1 <= value <= 5):
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
            url = company.logo.url
            return request.build_absolute_uri(url) if request else url

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
        review = self.context.get("review")
        user = request.user if request else None

        if not user or not user.is_authenticated:
            raise serializers.ValidationError(
                "Authentication required."
            )

        return attrs


# =========================================================
# REVIEW DASHBOARD (ADMIN / OWNER)
# =========================================================

class ReviewDashboardSerializer(serializers.ModelSerializer):
    reply = ReviewReplySerializer(read_only=True)

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
            "is_approved",
            "created_at",
            "reply",
        ]
