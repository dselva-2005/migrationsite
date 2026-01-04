from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from review.models import Review
from review.permissions import can_moderate_review
from review.utils import get_company_from_review
from company.utils import recalculate_company_rating
from company.models import Company, CompanyMembership
from .serializers import ReviewBulkActionSerializer
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Review, ReviewReply
from .serializers import (
    ReviewReplySerializer,
    ReviewReplyCreateSerializer,
    ReviewMediaUploadSerializer
)
from .tasks import send_review_approved_email


class ReviewBulkActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReviewBulkActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ids = serializer.validated_data["ids"]
        action = serializer.validated_data["action"]

        approved = action == "approve"

        reviews = Review.objects.select_related("content_type").filter(id__in=ids)

        companies = {
            review.content_object
            for review in reviews
            if isinstance(review.content_object, Company)
        }

        with transaction.atomic():
            updated = reviews.update(is_approved=approved)

            for company in companies:
                recalculate_company_rating(company)

        return Response(
            {
                "detail": f"{updated} reviews updated",
                "approved": approved,
                "companies_updated": len(companies),
            },
            status=status.HTTP_200_OK,
        )


class ApproveReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        review = Review.objects.select_related().get(pk=pk)

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

        # ⛔ Prevent duplicate emails
        if review.is_approved:
            return Response(
                {"detail": "Review already approved"},
                status=status.HTTP_200_OK,
            )

        review.is_approved = True
        review.save(update_fields=["is_approved"])

        # ✅ Send approval email
        send_review_approved_email.delay(
            user_id=review.user.id,
            review_id=review.id,
        )

        return Response({"detail": "Review approved"})


class RejectReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        review = Review.objects.get(pk=pk)

        if not can_moderate_review(request.user, review):
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not review.is_approved:
            return Response(
                {"detail": "Already rejected"},
                status=status.HTTP_200_OK,
            )

        review.is_approved = False
        review.save(update_fields=["is_approved"])

        company = get_company_from_review(review)
        recalculate_company_rating(company)

        return Response({"detail": "Review rejected"})


class ReviewReplyUpsertView(generics.GenericAPIView):
    """
    Company OWNER / MANAGER can create or update a reply to a review.
    One reply per review.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReviewReplyCreateSerializer

    def get_review(self):
        try:
            return Review.objects.get(pk=self.kwargs["review_id"])
        except Review.DoesNotExist:
            raise PermissionDenied("Review not found")

    def post(self, request, review_id):
        review = self.get_review()

        # ⛔ Permission logic (you already copied it earlier)
        if not request.user.is_staff and not request.user.is_superuser:
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


class ReviewMediaUploadView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReviewMediaUploadSerializer

    def get_review(self):
        """
        Get the review object for this media upload
        """
        try:
            return Review.objects.get(pk=self.kwargs["review_id"])
        except Review.DoesNotExist:
            raise ValidationError("Review not found")

    def get_serializer_context(self):
        """
        Add review to serializer context
        """
        context = super().get_serializer_context()
        context["review"] = self.get_review()
        return context

    def perform_create(self, serializer):
        review = self.get_review()

        # Max 5 media files per review
        if review.media.count() >= 5:
            raise ValidationError("Maximum 5 media files allowed")

        # Only the review owner or staff can upload
        if review.user != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied("Not allowed")

        # Save the serializer
        serializer.save()