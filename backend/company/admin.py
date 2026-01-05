# company/admin.py
from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from django.db import transaction
from company.models import Company, CompanyMembership
from .models import (
    Company,
    CompanyCategory,
    CompanyOnboardingRequest,
    CompanyMembership,
)
from review.models import Review
from django.utils import timezone
from django.contrib import messages
from django.utils.html import format_html


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
        "is_verified",
        "is_approved",
        "created_at",
        "media_preview",
    )

    fields = (
        "rating",
        "author_name",
        "title",
        "body",
        "media_preview",
        "is_verified",
        "is_approved",
        "created_at",
    )

    def media_preview(self, obj):
        """
        Display review media thumbnails / links
        """
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
                            style="max-height:80px; max-width:120px; margin:4px;
                                    border-radius:4px; object-fit:cover;" />
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


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
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
        "created_at",
    )

    search_fields = (
        "name",
        "slug",
        "description",
    )

    prepopulated_fields = {"slug": ("name",)}

    readonly_fields = (
        "rating_average",
        "rating_count",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Basic Info",
            {"fields": ("name", "slug", "tagline", "description", "category")},
        ),
        ("Branding", {"fields": ("logo", "cover_image", "website")}),
        ("Trust & Visibility", {"fields": ("is_verified", "is_active")}),
        ("SEO", {"fields": ("meta_title", "meta_description")}),
        (
            "System",
            {"fields": ("rating_average", "rating_count", "created_at", "updated_at")},
        ),
    )

    ordering = ("-rating_average", "-rating_count")
    inlines = [ReviewInline]


@admin.register(CompanyCategory)
class CompanyCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@transaction.atomic
def approve_onboarding_request(request_obj, admin_user):
    if request_obj.status != "PENDING":
        raise ValueError("Request already processed")

    if request_obj.request_type == "NEW":
        company = Company.objects.create(
            name=request_obj.company_name,
            tagline=request_obj.tagline,
            description=request_obj.description,
            website=request_obj.website,
            owner=request_obj.user,
        )
    else:
        company = request_obj.company
        if not company:
            raise ValueError("Existing company not set")

    CompanyMembership.objects.create(
        user=request_obj.user, company=company, role="OWNER", status="ACTIVE"
    )

    request_obj.status = "APPROVED"
    request_obj.company = company
    request_obj.reviewed_by = admin_user
    request_obj.reviewed_at = timezone.now()
    request_obj.save()


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
            company = None

            # NEW COMPANY → create it
            if req.request_type == "NEW":
                company = Company.objects.create(
                    name=req.company_name,
                    tagline=req.tagline,
                    description=req.description,
                    website=req.website,
                    owner=req.user,
                    is_verified=True,
                )
            else:
                company = req.company

            # Create or activate membership
            CompanyMembership.objects.update_or_create(
                user=req.user,
                company=company,
                defaults={
                    "role": "OWNER",
                    "status": "ACTIVE",
                },
            )

            req.status = "APPROVED"
            req.reviewed_by = request.user
            req.reviewed_at = timezone.now()
            req.save()

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
