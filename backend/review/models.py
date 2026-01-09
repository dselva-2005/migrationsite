from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField

class Review(models.Model):

    class ModerationStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    moderation_status = models.CharField(
        max_length=20,
        choices=ModerationStatus.choices,
        default=ModerationStatus.PENDING,
        db_index=True,
    )
    # --------------------
    # Generic Target
    # --------------------
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    # --------------------
    # Review Content
    # --------------------
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=255, blank=True)
    body = models.TextField()

    # --------------------
    # Author Info (public)
    # --------------------
    author_name = models.CharField(max_length=120)
    author_email = models.EmailField(blank=True)

    # --------------------
    # Moderation & Trust
    # --------------------
    is_verified = models.BooleanField(default=False)

    # --------------------
    # Anti-abuse
    # --------------------
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)

    # --------------------
    # Timestamps
    # --------------------
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    # --------------------
    # Optional Auth User
    # --------------------
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviews",
    )
    search_vector = SearchVectorField(null=True)  # <-- Postgres full-text
    
    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "content_type", "object_id"],
                name="unique_review_per_user_per_object",
                condition=models.Q(user__isnull=False),
            )
        ]
        indexes = [
            GinIndex(fields=["search_vector"]),
            models.Index(fields=["content_type", "object_id"]),
            models.Index(fields=["rating"]),
            models.Index(fields=["moderation_status"]),
        ]

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.rating}★ - {self.author_name}"


# =========================================================
# REVIEW REPLY (Company Owner / Manager)
# =========================================================

class ReviewReply(models.Model):
    """
    One official reply from company owner/manager per review
    """

    review = models.OneToOneField(
        Review,
        on_delete=models.CASCADE,
        related_name="reply"
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="review_replies"
    )

    body = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Reply to Review #{self.review_id}"



def review_media_upload_path(instance, filename):
    return f"reviews/{instance.review_id}/{filename}"


class ReviewMedia(models.Model):
    MEDIA_TYPE_CHOICES = (
        ("image", "Image"),
        ("video", "Video"),
    )

    review = models.ForeignKey(
        "Review",
        on_delete=models.CASCADE,
        related_name="media",
    )

    file = models.FileField(
        upload_to=review_media_upload_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp", "mp4", "mov", "webm"]
            )
        ],
    )

    media_type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPE_CHOICES,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["media_type"]),
        ]

    def __str__(self):
        return f"{self.media_type} for Review #{self.review_id}"


class EmailTemplate(models.Model):
    key = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique identifier e.g. REVIEW_APPROVED"
    )

    subject = models.CharField(max_length=255)
    body = models.TextField(
        help_text="You can use placeholders like {{ username }}"
    )

    is_active = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key