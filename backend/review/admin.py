from django.contrib import admin
from django.utils.html import format_html
from .models import Review, ReviewReply, ReviewMedia


# =====================================================
# REVIEW MEDIA ADMIN (standalone)
# =====================================================

@admin.register(ReviewMedia)
class ReviewMediaAdmin(admin.ModelAdmin):
    list_display = (
        "review",
        "media_type",
        "file",
        "created_at",
    )

    list_filter = (
        "media_type",
    )


# =====================================================
# REVIEW MEDIA INLINE (inside Review)
# =====================================================

class ReviewMediaInline(admin.TabularInline):
    model = ReviewMedia
    extra = 0
    can_delete = False

    readonly_fields = (
        "media_preview",
        "media_type",
        "file",
        "created_at",
    )

    fields = (
        "media_preview",
        "media_type",
        "file",
        "created_at",
    )

    def media_preview(self, obj):
        if not obj.file:
            return "—"

        url = obj.file.url

        if obj.media_type == "image":
            return format_html(
                '<a href="{}" target="_blank">'
                '<img src="{}" style="max-height:80px; '
                'max-width:120px; border-radius:4px; object-fit:cover;" />'
                "</a>",
                url,
                url,
            )

        return format_html(
            '<a href="{}" target="_blank">🎥 {}</a>',
            url,
            obj.file.name.split("/")[-1],
        )

    media_preview.short_description = "Preview"


# =====================================================
# REVIEW REPLY INLINE (One-to-One)
# =====================================================

class ReviewReplyInline(admin.StackedInline):
    model = ReviewReply
    extra = 0
    can_delete = False

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fields = (
        "author",
        "body",
        "created_at",
        "updated_at",
    )

    def has_add_permission(self, request, obj=None):
        if obj and hasattr(obj, "reply"):
            return False
        return True


# =====================================================
# CUSTOM FILTER: HAS MEDIA
# =====================================================

class HasMediaFilter(admin.SimpleListFilter):
    title = "Has Media"
    parameter_name = "has_media"

    def lookups(self, request, model_admin):
        return (
            ("yes", "Has media"),
            ("no", "No media"),
        )

    def queryset(self, request, queryset):
        if self.value() == "yes":
            return queryset.filter(media__isnull=False).distinct()
        if self.value() == "no":
            return queryset.filter(media__isnull=True)
        return queryset


# =====================================================
# REVIEW ADMIN
# =====================================================

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "content_type",
        "object_id",
        "rating",
        "author_name",
        "has_reply",
        "has_media",      # ✅ NEW
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
        "reply",
        HasMediaFilter,   # ✅ NEW
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

    inlines = [
        ReviewReplyInline,
        ReviewMediaInline,
    ]

    # ---------------------------------
    # Optimized queryset
    # ---------------------------------
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related("reply").prefetch_related("media")

    # ---------------------------------
    # Boolean column: Has Reply
    # ---------------------------------
    @admin.display(
        boolean=True,
        ordering="reply__id",
        description="Has Reply",
    )
    def has_reply(self, obj):
        return hasattr(obj, "reply")

    # ---------------------------------
    # Boolean column: Has Media
    # ---------------------------------
    @admin.display(
        boolean=True,
        description="Has Media",
    )
    def has_media(self, obj):
        return obj.media.exists()
