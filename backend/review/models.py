from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.conf import settings


class Review(models.Model):
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
    is_approved = models.BooleanField(default=True)

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

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
            models.Index(fields=["rating"]),
            models.Index(fields=["is_approved"]),
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
