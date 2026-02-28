from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    # =========
    # LIST VIEW
    # =========
    list_display = (
        "unread_badge",
        "name",
        "email",
        "phone",
        "status",
        "created_at",
    )

    list_filter = (
        "is_read",
        "status",
        "source",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
        "phone",
        "message",
        "extra_data",
    )

    ordering = ("is_read", "-created_at")  # unread first

    date_hierarchy = "created_at"

    # =========
    # READ ONLY
    # =========
    readonly_fields = (
        "user",
        "name",
        "email",
        "phone",
        "message",
        "extra_data",
        "source",
        "ip_address",
        "user_agent",
        "created_at",
        "updated_at",
        "read_at",
    )

    # =========
    # DETAIL VIEW LAYOUT
    # =========
    fieldsets = (
        ("User / Source", {
            "fields": ("user", "source"),
        }),
        ("Contact Details", {
            "fields": ("name", "email", "phone"),
        }),
        ("Message", {
            "fields": ("message",),
        }),
        ("Extra Form Data", {
            "classes": ("collapse",),
            "fields": ("extra_data",),
        }),
        ("Admin Workflow", {
            "fields": ("status",),
        }),
        ("Read Tracking", {
            "fields": ("is_read", "read_at"),
        }),
        ("Request Metadata", {
            "classes": ("collapse",),
            "fields": ("ip_address", "user_agent"),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
        }),
    )

    # =========
    # BULK ACTIONS
    # =========
    actions = (
        "mark_as_read",
        "mark_as_replied",
        "mark_as_closed",
    )

    # =========
    # UNREAD BADGE
    # =========
    @admin.display(description="New")
    def unread_badge(self, obj):
        if not obj.is_read:
            return format_html(
                '<span style="color:white;background:red;padding:3px 6px;border-radius:4px;">NEW</span>'
            )
        return "—"

    # =========
    # ACTION METHODS
    # =========
    @admin.action(description="Mark selected as Read")
    def mark_as_read(self, request, queryset):
        queryset.update(
            is_read=True,
            read_at=timezone.now(),
            status=ContactMessage.STATUS_READ,
        )

    @admin.action(description="Mark selected as Replied")
    def mark_as_replied(self, request, queryset):
        queryset.update(
            status=ContactMessage.STATUS_REPLIED,
            is_read=True,
            read_at=timezone.now(),
        )

    @admin.action(description="Mark selected as Closed")
    def mark_as_closed(self, request, queryset):
        queryset.update(
            status=ContactMessage.STATUS_CLOSED,
            is_read=True,
            read_at=timezone.now(),
        )

    # =========
    # AUTO MARK WHEN OPENED
    # =========
    def change_view(self, request, object_id, form_url="", extra_context=None):
        obj = self.get_object(request, object_id)

        if obj and not obj.is_read:
            obj.is_read = True
            obj.read_at = timezone.now()

            # optional: also move status from NEW → READ
            if obj.status == ContactMessage.STATUS_NEW:
                obj.status = ContactMessage.STATUS_READ

            obj.save(update_fields=["is_read", "read_at", "status"])

        return super().change_view(request, object_id, form_url, extra_context)