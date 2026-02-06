# apps/contact/admin.py

from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    # =========
    # LIST VIEW
    # =========
    list_display = (
        "name",
        "email",
        "phone",
        "status",
        "created_at",
    )

    list_filter = (
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

    ordering = ("-created_at",)

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
        ("Admin Actions", {
            "fields": ("status",),
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
    # ACTION METHODS
    # =========
    @admin.action(description="Mark selected as Read")
    def mark_as_read(self, request, queryset):
        queryset.update(status=ContactMessage.STATUS_READ)

    @admin.action(description="Mark selected as Replied")
    def mark_as_replied(self, request, queryset):
        queryset.update(status=ContactMessage.STATUS_REPLIED)

    @admin.action(description="Mark selected as Closed")
    def mark_as_closed(self, request, queryset):
        queryset.update(status=ContactMessage.STATUS_CLOSED)

    # =========
    # UX POLISH
    # =========
    def change_view(self, request, object_id, form_url="", extra_context=None):
        """
        Auto-mark message as READ when admin opens it.
        """
        obj = self.get_object(request, object_id)
        if obj and obj.status == ContactMessage.STATUS_NEW:
            obj.status = ContactMessage.STATUS_READ
            obj.save(update_fields=["status"])
        return super().change_view(request, object_id, form_url, extra_context)
