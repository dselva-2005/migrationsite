from django.urls import path
from review.views import (
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
    )
]
