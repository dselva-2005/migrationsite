from django.contrib import admin
from django.utils.html import format_html
from django.contrib import messages
from .models import Review, ReviewReply, ReviewMedia, EmailTemplate
from .tasks import send_review_approved_email, send_review_rejected_email


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

    readonly_fields = ("media_preview",)

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
# REVIEW ADMIN WITH ACTIONS AND EDITABLE FIELDS
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
        "has_media",
        "is_verified",
        "moderation_status",
        "created_at",
    )

    list_filter = (
        "rating",
        "is_verified",
        "moderation_status",
        "content_type",
        "user",
        "reply",
        HasMediaFilter,
    )

    search_fields = (
        "author_name",
        "title",
        "body",
    )

    inlines = [
        ReviewReplyInline,
        ReviewMediaInline,
    ]

    # ✅ ADDED: fieldsets to organize editable fields
    fieldsets = (
        ("Review Information", {
            "fields": (
                "content_type",
                "object_id",
                "title",
                "body",
                "rating",
            )
        }),
        ("Author Information", {
            "fields": (
                "user",
                "author_name",
                "author_email",
            )
        }),
        ("Moderation & Verification", {
            "fields": (
                "moderation_status",
                "is_verified",
            )
        }),
        ("Technical Information", {
            "fields": (
                "ip_address",
                "user_agent",
            ),
            "classes": ("collapse",)  # Makes this section collapsible
        }),
        ("Timestamps", {
            "fields": (
                "created_at",
                "updated_at",
            ),
            "classes": ("collapse",)  # Makes this section collapsible
        }),
    )

    # ✅ NEW: Add bulk actions
    actions = ['approve_reviews', 'reject_reviews']

    # ---------------------------------
    # Optimized queryset
    # ---------------------------------
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related("reply", "user").prefetch_related("media")

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

    # ---------------------------------
    # ✅ NEW: Approve Reviews Action
    # ---------------------------------
    def approve_reviews(self, request, queryset):
        # Get reviews that can be approved (not already approved)
        reviews_to_approve = queryset.exclude(moderation_status='approved')
        
        approved_count = 0
        for review in reviews_to_approve:
            review.moderation_status = 'approved'
            review.save()
            approved_count += 1
            
            # Send email notification if user exists
            if review.user and review.user.email:
                try:
                    send_review_approved_email.delay(review.user.id, review.id)
                except Exception as e:
                    # Log error but continue processing
                    self.message_user(
                        request,
                        f"Failed to send email for review {review.id}: {str(e)}",
                        level=messages.WARNING
                    )
        
        # Count of already approved reviews
        already_approved = queryset.filter(moderation_status='approved').count()
        
        if approved_count > 0:
            self.message_user(
                request,
                f"Successfully approved {approved_count} review(s). {already_approved} were already approved.",
                level=messages.SUCCESS
            )
        else:
            self.message_user(
                request,
                f"No reviews to approve. {already_approved} review(s) were already approved.",
                level=messages.WARNING
            )
    
    approve_reviews.short_description = "✅ Approve selected reviews"

    # ---------------------------------
    # ✅ NEW: Reject Reviews Action
    # ---------------------------------
    def reject_reviews(self, request, queryset):
        # Get reviews that can be rejected (not already rejected)
        reviews_to_reject = queryset.exclude(moderation_status='rejected')
        
        rejected_count = 0
        for review in reviews_to_reject:
            review.moderation_status = 'rejected'
            review.save()
            rejected_count += 1
            
            # Send email notification if user exists
            if review.user and review.user.email:
                try:
                    send_review_rejected_email.delay(review.user.id, review.id)
                except Exception as e:
                    # Log error but continue processing
                    self.message_user(
                        request,
                        f"Failed to send email for review {review.id}: {str(e)}",
                        level=messages.WARNING
                    )
        
        # Count of already rejected reviews
        already_rejected = queryset.filter(moderation_status='rejected').count()
        
        if rejected_count > 0:
            self.message_user(
                request,
                f"Successfully rejected {rejected_count} review(s). {already_rejected} were already rejected.",
                level=messages.SUCCESS
            )
        else:
            self.message_user(
                request,
                f"No reviews to reject. {already_rejected} review(s) were already rejected.",
                level=messages.WARNING
            )
    
    reject_reviews.short_description = "❌ Reject selected reviews"


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ("key", "is_active", "updated_at")
    search_fields = ("key", "subject")