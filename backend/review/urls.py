from django.urls import path
from review.views import (
    ApproveReviewView,
    RejectReviewView,
    ReviewReplyUpsertView,
    ReviewMediaUploadView,
)

urlpatterns = [
    path(
        "<int:review_id>/media/",
        ReviewMediaUploadView.as_view(),
    ),
    path(
        "<int:review_id>/reply/",
        ReviewReplyUpsertView.as_view(),
        name="review-reply-upsert",
    ),
    path("<int:pk>/approve/", ApproveReviewView.as_view()),
    path("<int:pk>/reject/", RejectReviewView.as_view()),
]
