from django.urls import path
from .views import (
    BlogPostListView,
    BlogPostDetailView,
    BlogPostReviewAPIView,
)

urlpatterns = [
    path("", BlogPostListView.as_view(), name="blog-list"),
    path("<slug:slug>/", BlogPostDetailView.as_view(), name="blog-detail"),
    path("<slug:slug>/reviews/", BlogPostReviewAPIView.as_view(), name="blog-reviews"),
]
