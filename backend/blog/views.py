# blog/views.py

from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Avg, Count, Q, F
from django.contrib.contenttypes.models import ContentType
from django.core.cache import cache

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status

from .models import BlogPost, BlogCategory
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogCategorySerializer,
)
from .pagination import BlogPostPagination

from review.serializers import ReviewSerializer, ReviewCreateSerializer
from review.services import get_reviews_for_object
from review.models import Review


# ------------------------------------
# Blog List (PAGINATED)
# ------------------------------------
class BlogPostListView(ListAPIView):
    """
    GET /api/blog/
    Supports pagination: ?page=<number>&page_size=<number>
    """

    permission_classes = [AllowAny]
    serializer_class = BlogPostListSerializer
    pagination_class = BlogPostPagination

    def get_queryset(self):
        ct = ContentType.objects.get_for_model(BlogPost)

        return (
            BlogPost.objects.select_related("author", "category")
            .prefetch_related("tags")
            .annotate(
                rating=Avg(
                    "reviews__rating",
                    filter=Q(
                        reviews__content_type=ct,
                        reviews__moderation_status=Review.ModerationStatus.APPROVED,
                    ),
                ),
                reviewCount=Count(
                    "reviews",
                    filter=Q(
                        reviews__content_type=ct,
                        reviews__moderation_status=Review.ModerationStatus.APPROVED,
                    ),
                ),
            )
            .filter(
                status="PUBLISHED",
                published_at__lte=timezone.now(),
            )
            .order_by("-published_at")
        )


# ------------------------------------
# Blog Detail
# ------------------------------------
class BlogPostDetailView(RetrieveAPIView):
    """
    GET /api/blog/<slug>/
    """

    permission_classes = [AllowAny]
    serializer_class = BlogPostDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        ct = ContentType.objects.get_for_model(BlogPost)

        return (
            BlogPost.objects.select_related("author", "category")
            .prefetch_related("tags")
            .annotate(
                rating=Avg(
                    "reviews__rating",
                    filter=Q(
                        reviews__content_type=ct,
                        reviews__moderation_status=Review.ModerationStatus.APPROVED,
                    ),
                ),
                reviewCount=Count(
                    "reviews",
                    filter=Q(
                        reviews__content_type=ct,
                        reviews__moderation_status=Review.ModerationStatus.APPROVED,
                    ),
                ),
            )
            .filter(
                status="PUBLISHED",
                published_at__lte=timezone.now(),
            )
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Identify viewer (user-id preferred, fallback to IP)
        if request.user.is_authenticated:
            viewer_id = f"user:{request.user.id}"
        else:
            ip = request.META.get("REMOTE_ADDR", "unknown")
            viewer_id = f"ip:{ip}"

        cache_key = f"blog:view:{instance.pk}:{viewer_id}"

        # Count view only once per viewer per 24h
        if not cache.get(cache_key):
            BlogPost.objects.filter(pk=instance.pk).update(
                view_count=F("view_count") + 1
            )
            cache.set(cache_key, True, timeout=60 * 60 * 24)

        return super().retrieve(request, *args, **kwargs)


# ------------------------------------
# Blog Reviews (GET + POST)
# ------------------------------------
class BlogPostReviewAPIView(APIView):
    """
    GET  /api/blog/<slug>/reviews/
    POST /api/blog/<slug>/reviews/
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, slug):
        blog = get_object_or_404(
            BlogPost,
            slug=slug,
            status="PUBLISHED",
            published_at__lte=timezone.now(),
        )

        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 10))

        data = get_reviews_for_object(
            obj=blog,
            page=page,
            page_size=page_size,
        )

        serializer = ReviewSerializer(data["results"], many=True)

        return Response(
            {
                "count": data["count"],
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request, slug):
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        blog = get_object_or_404(
            BlogPost,
            slug=slug,
            status="PUBLISHED",
            published_at__lte=timezone.now(),
        )

        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(
            content_type=ContentType.objects.get_for_model(BlogPost),
            object_id=blog.id,
            title=serializer.validated_data.get("title", ""),
            author_name=request.user.username,
            author_email=request.user.email,
            user=request.user,
            is_verified=True,
            moderation_status=Review.ModerationStatus.PENDING,
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

        return Response(
            {"detail": "Review submitted and pending moderation"},
            status=status.HTTP_201_CREATED,
        )


# ------------------------------------
# Blog Categories
# ------------------------------------
class BlogCategoryListView(ListAPIView):
    """
    GET /api/blog/categories/
    """

    permission_classes = [AllowAny]
    serializer_class = BlogCategorySerializer

    def get_queryset(self):
        return (
            BlogCategory.objects.annotate(
                post_count=Count(
                    "posts",
                    filter=Q(
                        posts__status="PUBLISHED",
                        posts__published_at__lte=timezone.now(),
                    ),
                )
            )
            .filter(post_count__gt=0)
            .order_by("name")
        )
