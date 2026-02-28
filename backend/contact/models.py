from django.conf import settings
from django.db import models


class ContactMessage(models.Model):
    """
    Stores contact form submissions.
    Designed to work with CMS-driven dynamic forms.
    """

    STATUS_NEW = "new"
    STATUS_READ = "read"
    STATUS_REPLIED = "replied"
    STATUS_CLOSED = "closed"

    STATUS_CHOICES = [
        (STATUS_NEW, "New"),
        (STATUS_READ, "Read"),
        (STATUS_REPLIED, "Replied"),
        (STATUS_CLOSED, "Closed"),
    ]

    # Optional authenticated user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contact_messages",
    )

    # Core normalized fields
    name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField()

    # Dynamic / extra form fields
    extra_data = models.JSONField(
        blank=True,
        null=True,
        help_text="Raw extra form fields submitted from CMS-driven form",
    )

    # Context
    source = models.CharField(
        max_length=100,
        blank=True,
        help_text="Page or section source (e.g. contact page)",
    )

    # Request metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    # ==========================
    # WORKFLOW STATUS
    # ==========================
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_NEW,
        db_index=True,
    )

    # ==========================
    # READ TRACKING (NEW)
    # ==========================
    is_read = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Indicates whether admin has opened the message.",
    )

    read_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when message was first opened.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["is_read", "-created_at"]  # unread first
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["email"]),
            models.Index(fields=["is_read"]),
        ]

    def __str__(self):
        return f"{self.name} <{self.email}> [{self.status}]"