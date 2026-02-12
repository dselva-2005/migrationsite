from django.urls import path
from .views import (
    CompanyListAPIView,
    CompanyDetailView,
    CompanyReviewAPIView,
    BusinessOnboardingView,
    CompanyList,
    CompanyDashboardView,
    CompanyLogoUpdateView,
    CompanyDashboardReviewAPIView,
    CompanyMyReviewAPIView,
    CompanySuggestionCreateView,
)

urlpatterns = [
    # -------------------------
    # Static routes (NO slug)
    # -------------------------
    path("list/", CompanyList.as_view(), name="company-list-internal"),
    path("business-login/", BusinessOnboardingView.as_view(), name="business-onboarding"),
    path("suggest-company/", CompanySuggestionCreateView.as_view(), name="suggest-company"),

    # -------------------------
    # Slug-based nested routes (specific first)
    # -------------------------
    path(
        "<slug:slug>/reviews/my/",
        CompanyMyReviewAPIView.as_view(),
        name="company-my-review",
    ),
    path(
        "<slug:slug>/dashboard/reviews/",
        CompanyDashboardReviewAPIView.as_view(),
        name="company-dashboard-reviews",
    ),
    path(
        "<slug:slug>/logo/",
        CompanyLogoUpdateView.as_view(),
        name="company-logo-update",
    ),
    path(
        "<slug:slug>/account/",
        CompanyDashboardView.as_view(),
        name="company-dashboard",
    ),
    path(
        "<slug:slug>/reviews/",
        CompanyReviewAPIView.as_view(),
        name="company-reviews",
    ),

    # -------------------------
    # Slug detail (generic catch-all)
    # -------------------------
    path(
        "<slug:slug>/",
        CompanyDetailView.as_view(),
        name="company-detail",
    ),

    # -------------------------
    # Root listing (keep last)
    # -------------------------
    path(
        "",
        CompanyListAPIView.as_view(),
        name="company-list",
    ),
]
