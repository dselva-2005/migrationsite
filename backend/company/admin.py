from django.contrib import admin, messages
from django.contrib.contenttypes.admin import GenericTabularInline
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone
from django.utils.html import format_html

from company.models import (
    Company,
    CompanyCategory,
    CompanyOnboardingRequest,
    CompanyMembership,
)
from review.models import Review


# ======================================================
# Review Inline
# ======================================================


class ReviewInline(GenericTabularInline):
    model = Review
    extra = 0
    can_delete = False
    show_change_link = True

    readonly_fields = (
        "rating",
        "author_name",
        "title",
        "body",
        "media_preview",
        "is_verified",
        "moderation_status",
        "created_at",
    )

    fields = (
        "rating",
        "author_name",
        "title",
        "body",
        "media_preview",
        "is_verified",
        "moderation_status",
        "created_at",
    )

    def media_preview(self, obj):
        media_qs = obj.media.all()
        if not media_qs.exists():
            return "—"

        html = []
        for media in media_qs:
            url = media.file.url
            if media.media_type == "image":
                html.append(
                    f"""
                    <a href="{url}" target="_blank">
                        <img src="{url}"
                             style="max-height:80px; max-width:120px;
                             margin:4px; border-radius:4px;
                             object-fit:cover;" />
                    </a>
                    """
                )
            else:
                html.append(
                    f"""
                    <a href="{url}" target="_blank">
                        🎥 {media.file.name.split('/')[-1]}
                    </a>
                    """
                )
        return format_html("".join(html))

    media_preview.short_description = "Media"


# ======================================================
# Company Admin
# ======================================================

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "city",
        "state",
        "country",
        "rating_average",
        "rating_count",
        "is_verified",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_verified",
        "is_active",
        "category",
        "country",
        "state",
        "city",
        "created_at",
    )

    search_fields = (
        "name",
        "slug",
        "description",
        "tagline",
        "city",
        "state",
        "country",
        "email",
        "phone",
    )

    prepopulated_fields = {"slug": ("name",)}

    readonly_fields = (
        "rating_average",
        "rating_count",
        "created_at",
        "updated_at",
        "search_vector",
    )

    fieldsets = (
        (
            "Core Identity",
            {
                "fields": (
                    "owner",
                    "name",
                    "slug",
                    "tagline",
                    "description",
                    "category",
                )
            },
        ),
        (
            "Contact Information",
            {
                "fields": (
                    "phone",
                    "email",
                    "website",
                )
            },
        ),
        (
            "Address",
            {
                "fields": (
                    "address_line_1",
                    "address_line_2",
                    "city",
                    "state",
                    "postal_code",
                    "country",
                )
            },
        ),
        (
            "Branding",
            {
                "fields": (
                    "logo",
                    "cover_image",
                )
            },
        ),
        (
            "Trust & Visibility",
            {
                "fields": (
                    "is_verified",
                    "is_active",
                )
            },
        ),
        (
            "SEO",
            {
                "fields": (
                    "meta_title",
                    "meta_description",
                    "search_vector",
                )
            },
        ),
        (
            "System",
            {
                "fields": (
                    "rating_average",
                    "rating_count",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    ordering = ("-rating_average", "-rating_count")
    inlines = [ReviewInline]



# ======================================================
# Category Admin
# ======================================================


@admin.register(CompanyCategory)
class CompanyCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


# ======================================================
# 🔥 SINGLE SOURCE OF TRUTH — APPROVAL LOGIC
# ======================================================


@transaction.atomic
def approve_onboarding_request(request_obj, admin_user):

    data = {
        "user_id": request_obj.user_id,
        "request_type": request_obj.request_type,
        "company_id": request_obj.company_id,
        "company_name": request_obj.company_name,
        "tagline": request_obj.tagline,
        "description": request_obj.description,
        "website": request_obj.website,
        "address_line_1": request_obj.address_line_1,
        "address_line_2": request_obj.address_line_2,
        "city": request_obj.city,
        "state": request_obj.state,
        "postal_code": request_obj.postal_code,
        "country": request_obj.country,
        "email": request_obj.email,
        "phone": request_obj.phone,
    }

    if data["request_type"] == "NEW":
        company = Company.objects.create(
            name=data["company_name"],
            tagline=data["tagline"],
            description=data["description"],
            website=data["website"],
            address_line_1=data["address_line_1"],
            address_line_2=data["address_line_2"],
            city=data["city"],
            state=data["state"],
            postal_code=data["postal_code"],
            country=data["country"],
            email=data["email"],
            phone=data["phone"],
            owner_id=data["user_id"],
            is_verified=True,
            is_active=True,
        )
    else:
        company = Company.objects.get(pk=data["company_id"])

    CompanyMembership.objects.update_or_create(
        user_id=data["user_id"],
        company=company,
        defaults={"role": "OWNER", "status": "ACTIVE"},
    )

    CompanyOnboardingRequest.objects.filter(pk=request_obj.pk).update(
        status="APPROVED",
        company=company,
        reviewed_by=admin_user,
        reviewed_at=timezone.now(),
    )


# ======================================================
# Onboarding Request Admin
# ======================================================


@admin.register(CompanyOnboardingRequest)
class CompanyOnboardingRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "request_type",
        "company_display",
        "status",
        "created_at",
        "reviewed_by",
    )

    list_filter = ("request_type", "status", "created_at")

    search_fields = (
        "user__email",
        "user__username",
        "company_name",
        "company__name",
    )

    readonly_fields = (
        "user",
        "request_type",
        "company",
        "company_name",
        "tagline",
        "description",
        "website",
        "address_line_1",
        "address_line_2",
        "city",
        "state",
        "postal_code",
        "country",
        "phone",
        "email",
        "created_at",
        "reviewed_by",
        "reviewed_at",
    )

    actions = ["approve_requests", "reject_requests"]

    def company_display(self, obj):
        if obj.request_type == "EXISTING":
            return obj.company
        return obj.company_name or "-"

    company_display.short_description = "Company"

    # -----------------------
    # Admin Actions
    # -----------------------

    def approve_requests(self, request, queryset):
        approved = 0

        for req in queryset.filter(status="PENDING"):
            approve_onboarding_request(req, request.user)
            approved += 1

        self.message_user(
            request,
            f"{approved} onboarding request(s) approved.",
            level=messages.SUCCESS,
        )

    approve_requests.short_description = "Approve selected requests"

    def reject_requests(self, request, queryset):
        rejected = queryset.filter(status="PENDING").update(
            status="REJECTED",
            reviewed_by=request.user,
            reviewed_at=timezone.now(),
        )

        self.message_user(
            request,
            f"{rejected} onboarding request(s) rejected.",
            level=messages.WARNING,
        )

    reject_requests.short_description = "Reject selected requests"

    # -----------------------
    # Lock editing after review
    # -----------------------

    def has_change_permission(self, request, obj=None):
        if obj and obj.status != "PENDING":
            return False
        return super().has_change_permission(request, obj)

admin.site.register(CompanyMembership)