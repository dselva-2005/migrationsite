from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .pagination import ReviewDashboardPagination
from rest_framework.exceptions import PermissionDenied
from company.models import Company
from company.pagination import CompanyPagination
from company.serializers import (
    CompanyListSerializer,
    CompanyDetailSerializer,
    CompanyListInfo,
    CompanyLogoUpdateSerializer,
    CompanyDashboardSerializer,
    BusinessOnboardingSerializer,
)
from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
)
from company.permissions import user_can_manage_company
from django.db import IntegrityError, transaction
from review.serializers import ReviewSerializer, ReviewCreateSerializer,ReviewDashboardSerializer
from review.services import get_reviews_for_object
from review.models import Review
from review.views import CompanyReviewUpdateAPIView

# ------------------------------------
# Company List
# ------------------------------------
class CompanyListAPIView(ListAPIView):
    serializer_class = CompanyListSerializer
    pagination_class = CompanyPagination

    def get_queryset(self):
        queryset = Company.objects.filter(is_active=True)

        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__slug=category)

        ordering = self.request.query_params.get("ordering")
        if ordering in ["rating_average", "rating_count", "created_at"]:
            queryset = queryset.order_by(f"-{ordering}")

        return queryset


# ------------------------------------
# Company Detail
# ------------------------------------
class CompanyDetailView(RetrieveAPIView):
    serializer_class = CompanyDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Company.objects.filter(is_active=True)


# ------------------------------------
# Company Reviews (GET + POST)
# ------------------------------------
class CompanyReviewAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, slug):
        company = get_object_or_404(
            Company,
            slug=slug,
            is_active=True,
        )

        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 4))

        data = get_reviews_for_object(
            obj=company,
            page=page,
            page_size=page_size,
        )

        reviews_serializer = ReviewSerializer(
            data["results"],
            many=True,
            context={"request": request},
        )

        return Response(
            {
                "count": data["count"],
                "results": reviews_serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    
    def post(self, request, slug):
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required to submit a review"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        company = get_object_or_404(
            Company,
            slug=slug,
            is_active=True,
        )

        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        content_type = ContentType.objects.get_for_model(Company)

        try:
            with transaction.atomic():
                review = serializer.save(
                    content_type=content_type,
                    object_id=company.id,
                    author_name=request.user.username,
                    author_email=request.user.email,
                    user=request.user,
                    is_verified=True,
                    moderation_status=Review.ModerationStatus.PENDING,
                    ip_address=request.META.get("REMOTE_ADDR"),
                    user_agent=request.META.get("HTTP_USER_AGENT", ""),
                )

        except IntegrityError:
            return Response(
                {"detail": "You have already reviewed this company"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "id": review.id,
                "detail": "Review submitted and pending moderation",
            },
            status=status.HTTP_201_CREATED,
        )
    
# ------------------------------------
# Business Onboarding
# ------------------------------------
class BusinessOnboardingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BusinessOnboardingSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Onboarding request submitted successfully"},
            status=status.HTTP_201_CREATED,
        )


# ------------------------------------
# Simple Company List (internal use)
# ------------------------------------
class CompanyList(APIView):
    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanyListInfo(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ------------------------------------
# Company Dashboard
# ------------------------------------
class CompanyDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        company = Company.objects.get(slug=slug)

        if not user_can_manage_company(request.user, company):
            return Response(
                {"detail": "Access denied"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CompanyDashboardSerializer(
            company,
            context={"request": request},
        )

        return Response(serializer.data)


# ------------------------------------
# Company Logo Update
# ------------------------------------
class CompanyLogoUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, slug):
        company = get_object_or_404(
            Company,
            slug=slug,
            is_active=True,
        )

        if not user_can_manage_company(request.user, company):
            return Response(
                {"detail": "Access denied"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CompanyLogoUpdateSerializer(
            company,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "detail": "Company logo updated successfully",
                "logo": serializer.data["logo"],
            },
            status=status.HTTP_200_OK,
        )



class CompanyDashboardReviewAPIView(ListAPIView):

    """
    Dashboard-only review listing with:
    - pagination
    - moderation status filter
    - PostgreSQL full-text search
    """

    permission_classes = [IsAuthenticated]
    serializer_class = ReviewDashboardSerializer
    pagination_class = ReviewDashboardPagination

    def get_company(self):
        company = get_object_or_404(Company, slug=self.kwargs["slug"])

        if not user_can_manage_company(self.request.user, company):
            raise PermissionDenied("Access denied")

        return company

    def get_queryset(self):
        company = self.get_company()
        ct = ContentType.objects.get_for_model(Company)

        qs = (
            Review.objects
            .filter(
                content_type=ct,
                object_id=company.id,
            )
            .select_related("user")
            .prefetch_related("media", "reply")
        )

        # 🔄 Moderation status filter
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(moderation_status=status_filter)

        # 🔍 Full-text search (GIN + search_vector)
        search = self.request.query_params.get("search")
        if search:
            query = SearchQuery(search)
            qs = (
                qs.annotate(rank=SearchRank(F("search_vector"), query))
                .filter(rank__gte=0.1)
                .order_by("-rank", "-created_at")
            )
        else:
            qs = qs.order_by("-created_at")

        return qs

class CompanyMyReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        company = get_object_or_404(
            Company,
            slug=slug,
            is_active=True,
        )

        content_type = ContentType.objects.get_for_model(Company)

        review = Review.objects.filter(
            content_type=content_type,
            object_id=company.id,
            user=request.user,
        ).first()

        if not review:
            return Response(
                {"detail": "No review found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ReviewSerializer(
            review,
            context={"request": request},
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def patch(self, request, slug):
        return CompanyReviewUpdateAPIView().patch(request, slug)