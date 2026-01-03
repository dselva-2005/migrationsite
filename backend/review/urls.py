from django.urls import path
from review.views import (
    ApproveReviewView,
    RejectReviewView,
    ReviewBulkActionView,
    ReviewReplyUpsertView,
)

urlpatterns = [
    path("<int:pk>/approve/", ApproveReviewView.as_view()),
    path("<int:pk>/reject/", RejectReviewView.as_view()),
    path("bulk-action/", ReviewBulkActionView.as_view()),
    path(
        "<int:review_id>/reply/",
        ReviewReplyUpsertView.as_view(),
        name="review-reply-upsert",
    ),
]
