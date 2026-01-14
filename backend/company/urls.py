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
)

urlpatterns = [
    path("list/", CompanyList.as_view()),
    path(
        "<slug:slug>/reviews/my/",
        CompanyMyReviewAPIView.as_view(),
        name="company-my-review",
    ),
    path("business-login/", BusinessOnboardingView.as_view()),
    path("<slug:slug>/reviews/", CompanyReviewAPIView.as_view()),
    path("<slug:slug>/account/", CompanyDashboardView.as_view()),
    path("", CompanyListAPIView.as_view()),
    path(
        "<slug:slug>/logo/",
        CompanyLogoUpdateView.as_view(),
        name="company-logo-update",
    ),
    path(
        "<slug:slug>/dashboard/reviews/",
        CompanyDashboardReviewAPIView.as_view(),
    ),
    path("<slug:slug>/", CompanyDetailView.as_view()),
]
