from django.db import models

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

    locale = models.CharField(
        max_length=10,
        default="en"
    )

    is_published = models.BooleanField(default=True)

    order = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("key", "page", "locale")
        ordering = ["page", "order"]
