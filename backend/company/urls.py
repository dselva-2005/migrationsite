from django.urls import path
from .views import (
    CompanyListAPIView,
    CompanyDetailView,
    CompanyReviewAPIView,
    BusinessOnboardingView,
    CompanyList,
    CompanyDashboardView
)

urlpatterns = [
    path("list/", CompanyList.as_view()),    
    path("business-login/", BusinessOnboardingView.as_view()),
    path("<slug:slug>/reviews/", CompanyReviewAPIView.as_view()),
    path("<slug:slug>/", CompanyDetailView.as_view()),
    path("", CompanyListAPIView.as_view()),
    path("<slug:slug>/account/", CompanyDashboardView.as_view()),
]
