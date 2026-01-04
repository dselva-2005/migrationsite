from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status

from company.models import Company
from company.pagination import CompanyPagination
from company.serializers import (
    CompanyListSerializer,
    CompanyDetailSerializer,
    CompanyListInfo,
)
from company.serializers import BusinessOnboardingSerializer
from company.permissions import user_can_manage_company
from company.serializers import CompanyDashboardSerializer
from review.serializers import ReviewSerializer, ReviewCreateSerializer
from review.services import get_reviews_for_object


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

        serializer = ReviewSerializer(
            data["results"],
            many=True,
            context={"request": request},
        )

        return Response(
            {
                "count": data["count"],
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request, slug):
        company = get_object_or_404(
            Company,
            slug=slug,
            is_active=True,
        )

        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # ✅ CAPTURE THE CREATED REVIEW
        review = serializer.save(
            content_type=ContentType.objects.get_for_model(Company),
            object_id=company.id,
            author_name=request.user.username,
            author_email=request.user.email,
            user=request.user,
            is_verified=True,
            is_approved=False,
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

        # ✅ RETURN THE ID
        return Response(
            {
                "id": review.id,
                "detail": "Review submitted successfully",
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
