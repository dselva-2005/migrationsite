from django.db import models
from django.utils import timezone


class MediaAsset(models.Model):
    ASSET_TYPE_CHOICES = [
        ("image", "Image"),
        ("icon", "Icon / SVG"),
        ("video", "Video"),
        ("file", "File"),
    ]

    title = models.CharField(
        max_length=255,
        help_text="Human readable name (e.g. Navbar Logo)"
    )

    asset_type = models.CharField(
        max_length=20,
        choices=ASSET_TYPE_CHOICES,
        default="image"
    )

    file = models.FileField(
        upload_to="assets/%Y/%m/"
    )

    alt_text = models.CharField(
        max_length=255,
        blank=True
    )

    locale = models.CharField(
        max_length=10,
        default="en"
    )

    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Content(models.Model):
    key = models.CharField(
        max_length=255,
        help_text="e.g. home.hero.title"
    )

    value = models.JSONField()

    content_type = models.CharField(
        max_length=50,
        choices=[
            ("text", "Text"),
            ("image", "Image"),
            ("richtext", "Rich Text"),
            ("list", "List"),
            ("object", "Object"),
        ]
    )

    page = models.CharField(
        max_length=100,
        help_text="e.g. home, about, footer"
    )

    # ✅ NEW FIELD (ONLY ADDITION)
    country = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Country slug like 'canada', 'australia'. Leave empty for global content."
    )

    locale = models.CharField(
        max_length=10,
        default="en"
    )

    is_published = models.BooleanField(default=True)

    order = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("key", "page", "locale", "country")
        ordering = ["page", "order"]

    def __str__(self):
        return f"{self.page} | {self.key} | {self.country or 'global'}"
