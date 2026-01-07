from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework import status, generics, permissions

from django.db import transaction

from review.models import Review, ReviewReply
from review.permissions import can_moderate_review
from review.utils import get_company_from_review
from company.utils import recalculate_company_rating
from company.models import Company, CompanyMembership

from .serializers import (
    ReviewReplySerializer,
    ReviewReplyCreateSerializer,
    ReviewMediaUploadSerializer,
)
from .tasks import (
    send_review_approved_email,
    send_review_rejected_email,
)


# ------------------------------------
# Approve Review
# ------------------------------------
class ApproveReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        review = Review.objects.select_related("user").get(pk=pk)

        company = review.content_object
        if not isinstance(company, Company):
            return Response(
                {"detail": "Invalid review target"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_allowed = CompanyMembership.objects.filter(
            user=request.user,
            company=company,
            role__in=["OWNER", "MANAGER"],
            status="ACTIVE",
        ).exists()

        if not is_allowed:
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if review.moderation_status == Review.ModerationStatus.APPROVED:
            return Response(
                {"detail": "Review already approved"},
                status=status.HTTP_200_OK,
            )

        with transaction.atomic():
            review.moderation_status = Review.ModerationStatus.APPROVED
            review.save(update_fields=["moderation_status", "updated_at"])
            recalculate_company_rating(company)

        if review.user_id:
            send_review_approved_email.delay(
                user_id=review.user_id,
                review_id=review.id,
            )

        return Response({"detail": "Review approved"})


# ------------------------------------
# Reject Review
# ------------------------------------
class RejectReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        review = Review.objects.select_related("user").get(pk=pk)

        if not can_moderate_review(request.user, review):
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if review.moderation_status == Review.ModerationStatus.REJECTED:
            return Response(
                {"detail": "Review already rejected"},
                status=status.HTTP_200_OK,
            )

        with transaction.atomic():
            review.moderation_status = Review.ModerationStatus.REJECTED
            review.save(update_fields=["moderation_status", "updated_at"])

            company = get_company_from_review(review)
            recalculate_company_rating(company)

        if review.user_id:
            send_review_rejected_email.delay(
                user_id=review.user_id,
                review_id=review.id,
            )

        return Response({"detail": "Review rejected"})


# ------------------------------------
# Review Reply (Upsert)
# ------------------------------------
class ReviewReplyUpsertView(generics.GenericAPIView):
    """
    Company OWNER / MANAGER can create or update a reply to a review.
    One reply per review.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = ReviewReplyCreateSerializer

    def get_review(self):
        try:
            return Review.objects.get(pk=self.kwargs["review_id"])
        except Review.DoesNotExist:
            raise PermissionDenied("Review not found")

    def post(self, request, review_id):
        review = self.get_review()

        if not can_moderate_review(request.user, review):
            raise PermissionDenied("Not allowed to reply to this review")

        reply, _ = ReviewReply.objects.update_or_create(
            review=review,
            defaults={
                "body": request.data.get("body"),
                "author": request.user,
            },
        )

        serializer = ReviewReplySerializer(
            reply,
            context={"request": request},
        )
        return Response(serializer.data)


# ------------------------------------
# Review Media Upload
# ------------------------------------
class ReviewMediaUploadView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReviewMediaUploadSerializer

    def get_review(self):
        try:
            return Review.objects.get(pk=self.kwargs["review_id"])
        except Review.DoesNotExist:
            raise ValidationError("Review not found")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["review"] = self.get_review()
        return context

    def perform_create(self, serializer):
        review = self.get_review()

        # Max 5 media files per review
        if review.media.count() >= 5:
            raise ValidationError("Maximum 5 media files allowed")

        # Only review owner or staff can upload
        if review.user != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied("Not allowed")

        serializer.save()
