from django.urls import path
from .views import (
    BlogPostListView,
    BlogPostDetailView,
    BlogPostReviewAPIView,
    BlogCategoryListView,
    BlogSitemapAPIView
)
urlpatterns = [
    path("", BlogPostListView.as_view(), name="blog-list"),
    path("sitemap/", BlogSitemapAPIView.as_view(), name="blog-sitemap"),
    path("categories/", BlogCategoryListView.as_view(), name="blog-categories"),
    path("<slug:slug>/", BlogPostDetailView.as_view(), name="blog-detail"),
    path("<slug:slug>/reviews/", BlogPostReviewAPIView.as_view(), name="blog-reviews"),
]
