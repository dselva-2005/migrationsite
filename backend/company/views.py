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
from rest_framework.exceptions import ValidationError
from urllib.parse import urlparse
from django.db.models.expressions import OrderBy
from django.core.cache import cache
from company.models import CompanySuggestion
from company.serializers import CompanySuggestionSerializer
from rest_framework.permissions import AllowAny
from django.utils.timezone import now
from datetime import timedelta



# ------------------------------------
# Company List
# ------------------------------------

class CompanyListAPIView(ListAPIView):
    serializer_class = CompanyListSerializer
    pagination_class = CompanyPagination

    def get_queryset(self):
        qs = Company.objects.filter(is_active=True)

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)

        qs = qs.order_by(
            OrderBy(F("display_order"), nulls_last=True),
            "-rating_average",
            "-rating_count",
        )

        return qs

# ------------------------------------
# Company Detail
# ------------------------------------
class CompanyDetailView(RetrieveAPIView):
    serializer_class = CompanyDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Company.objects.filter(is_active=True)

    def retrieve(self, request, *args, **kwargs):
        company = self.get_object()

        # Identify viewer
        if request.user.is_authenticated:
            viewer_id = f"user:{request.user.id}"
        else:
            ip = request.META.get("REMOTE_ADDR", "unknown")
            viewer_id = f"ip:{ip}"

        cache_key = f"company:view:{company.pk}:{viewer_id}"

        # Count once per 24h
        if not cache.get(cache_key):
            Company.objects.filter(pk=company.pk).update(
                view_count=F("view_count") + 1
            )
            cache.set(cache_key, True, 60 * 60 * 24)

        return super().retrieve(request, *args, **kwargs)


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
        data = request.data.copy()

        # 🔒 WEBSITE / DOMAIN VALIDATION (MOST IMPORTANT FIELD)
        website = data.get("website", "").strip()

        if website:
            parsed = urlparse(website)

            if parsed.scheme not in ("http", "https") or not parsed.netloc:
                return Response(
                    {
                        "detail": (
                            "Website must be a valid URL starting with "
                            "http:// or https:// (e.g. https://www.example.com)"
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = BusinessOnboardingSerializer(
            data=data,
            context={"request": request},
        )

        try:
            serializer.is_valid(raise_exception=True)

            with transaction.atomic():
                serializer.save()

        except ValidationError as e:
            return Response(
                {
                    "detail": "Invalid data provided",
                    "errors": e.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except IntegrityError:
            return Response(
                {
                    "detail": "A conflicting onboarding request already exists",
                },
                status=status.HTTP_409_CONFLICT,
            )

        except Exception:
            return Response(
                {
                    "detail": "Failed to submit onboarding request",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "detail": "Onboarding request submitted successfully",
            },
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
    

# ------------------------------------
# Company Suggestion (Public Form)
# ------------------------------------
class CompanySuggestionCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CompanySuggestionSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        # 🔒 Rate limit basic protection (per IP - 5 per hour)
        ip_address = request.META.get("REMOTE_ADDR")
        one_hour_ago = now() - timedelta(hours=1)

        recent_count = CompanySuggestion.objects.filter(
            ip_address=ip_address,
            created_at__gte=one_hour_ago,
        ).count()

        if recent_count >= 5:
            return Response(
                {"detail": "Too many submissions. Please try again later."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        try:
            with transaction.atomic():
                suggestion = serializer.save(
                    submitted_by=request.user
                    if request.user.is_authenticated
                    else None,
                    ip_address=ip_address,
                    user_agent=request.META.get("HTTP_USER_AGENT", ""),
                )

        except Exception:
            return Response(
                {"detail": "Failed to submit suggestion"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"detail": "Company suggestion submitted successfully"},
            status=status.HTTP_201_CREATED,
        )
