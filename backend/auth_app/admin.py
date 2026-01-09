from django.contrib import admin
from django.db.models import Exists, OuterRef, Q

from .models import User
from company.models import Company, CompanyMembership, CompanyOnboardingRequest


# =====================================================
# Custom Admin Filter
# =====================================================

class IsBusinessUserFilter(admin.SimpleListFilter):
    title = "Business user"
    parameter_name = "is_business_user"

    def lookups(self, request, model_admin):
        return (
            ("yes", "Yes"),
            ("no", "No"),
        )

    def queryset(self, request, queryset):
        if self.value() == "yes":
            return queryset.filter(
                Q(has_company=True)
                | Q(has_membership=True)
                | Q(has_onboarding=True)
            )

        if self.value() == "no":
            return queryset.filter(
                has_company=False,
                has_membership=False,
                has_onboarding=False,
            )

        return queryset


# =====================================================
# User Admin
# =====================================================

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "is_business_user",   # ✔ badge
        "is_active",
        "is_staff",
    )

    search_fields = (
        "username",
        "email",
    )

    list_filter = (
        "is_active",
        "is_staff",
        IsBusinessUserFilter,
    )

    ordering = ("id",)

    # -------------------------------------------------
    # Annotate once (PERFECT)
    # -------------------------------------------------
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(
            has_company=Exists(
                Company.objects.filter(owner=OuterRef("pk"))
            ),
            has_membership=Exists(
                CompanyMembership.objects.filter(user=OuterRef("pk"))
            ),
            has_onboarding=Exists(
                CompanyOnboardingRequest.objects.filter(user=OuterRef("pk"))
            ),
        )

    # -------------------------------------------------
    # Business User Badge
    # -------------------------------------------------
    @admin.display(boolean=True, description="Business user")
    def is_business_user(self, obj):
        return obj.has_company or obj.has_membership or obj.has_onboarding
