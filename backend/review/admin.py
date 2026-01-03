# reviews/admin.py
from django.contrib import admin
from .models import Review,ReviewReply


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "content_type",
        "object_id",
        "rating",
        "author_name",
        "is_verified",
        "is_approved",
        "created_at",
    )

    list_filter = (
        "rating",
        "is_verified",
        "is_approved",
        "content_type",
        "user",
    )

    search_fields = (
        "author_name",
        "title",
        "body",
    )

    readonly_fields = (
        "content_type",
        "object_id",
        "ip_address",
        "user_agent",
        "created_at",
        "updated_at",
    )


admin.site.register(ReviewReply)