from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Content
from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
    TrigramSimilarity,
)
from blog.models import BlogPost
from company.models import Company
from django.db import models
from django.db.models.expressions import RawSQL

from django.db.models import (
    Q,
    Value,
    Case,
    When,
    IntegerField,
    Avg,
    Count,
)


class PageContentView(APIView):
    def get(self, request, page):
        contents = Content.objects.filter(page=page, is_published=True)

        data = {}
        for item in contents:
            data[item.key] = item.value

        return Response(data)


class SearchView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        q = request.query_params.get("q", "").strip()
        q_len = len(q)

        if not q:
            return Response({"blogs": [], "companies": []})

        allow_trigram = q_len >= 2
        allow_fts_blog = q_len >= 3

        # ======================
        # BLOG SEARCH
        # ======================
        blogs = (
            BlogPost.objects.filter(status=BlogPost.Status.PUBLISHED)
            .annotate(
                similarity=(
                    TrigramSimilarity("title", q)
                    if allow_trigram
                    else models.Value(0.0)
                ),
                rank=(
                    SearchRank("search_vector", SearchQuery(q))
                    if allow_fts_blog
                    else models.Value(0.0)
                ),
                word_prefix=RawSQL(
                    "title ~* %s",
                    [rf"\m{q}"],
                ),
            )
            .filter(
                Q(word_prefix=True)
                | (Q(similarity__gt=0.35) if allow_trigram else Q())
                | (Q(rank__gt=0.15) if allow_fts_blog else Q())
            )
            .order_by(
                models.Case(
                    models.When(word_prefix=True, then=0),
                    default=1,
                    output_field=models.IntegerField(),
                ),
                "-rank",
                "-similarity",
                "-published_at",
            )[:5]
        )

        # ======================
        # COMPANY SEARCH (FIXED)
        # ======================
        companies = (
            Company.objects.filter(is_active=True)
            .annotate(
                similarity=(
                    TrigramSimilarity("name", q) if allow_trigram else models.Value(0.0)
                ),
                word_prefix=RawSQL(
                    "name ~* %s",
                    [rf"\m{q}"],
                ),
            )
            .filter(
                # ✅ word-start match (Technology, Tech, Telecom)
                Q(word_prefix=True)
                | (Q(similarity__gt=0.45) if allow_trigram else Q())
            )
            .order_by(
                models.Case(
                    models.When(word_prefix=True, then=0),
                    default=1,
                    output_field=models.IntegerField(),
                ),
                "-similarity",
                "-rating_average",
                "-rating_count",
            )[:5]
        )

        return Response(
            {
                "blogs": [
                    {"id": b.id, "title": b.title, "slug": b.slug} for b in blogs
                ],
                "companies": [
                    {"id": c.id, "name": c.name, "slug": c.slug} for c in companies
                ],
            }
        )


class FullSearchView(APIView):
    """
    Full search endpoint for blogs and companies, with pagination.
    """

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        q = request.query_params.get("q", "").strip()

        if not q:
            return Response(
                {
                    "query": "",
                    "blogs": [],
                    "companies": [],
                    "meta": {
                        "page": 1,
                        "limit": 10,
                        "total_blogs": 0,
                        "total_companies": 0,
                    },
                }
            )

        page = max(int(request.query_params.get("page", 1)), 1)
        limit = min(int(request.query_params.get("limit", 10)), 50)
        offset = (page - 1) * limit

        q_len = len(q)
        allow_trigram = q_len >= 2
        allow_fts_blog = q_len >= 3

        # =====================================================
        # BLOG SEARCH (LOGIC UNCHANGED)
        # =====================================================
        blogs_qs = (
            BlogPost.objects.filter(status=BlogPost.Status.PUBLISHED)
            .annotate(
                similarity=(
                    TrigramSimilarity("title", q) if allow_trigram else Value(0.0)
                ),
                rank=(
                    SearchRank("search_vector", SearchQuery(q))
                    if allow_fts_blog
                    else Value(0.0)
                ),
                word_prefix=RawSQL("blog_blogpost.title ~* %s", [rf"\m{q}"]),
                avg_rating=Avg("reviews__rating"),
                review_count=Count("reviews"),
            )
            .filter(
                Q(word_prefix=True)
                | (Q(similarity__gt=0.35) if allow_trigram else Q())
                | (Q(rank__gt=0.15) if allow_fts_blog else Q())
            )
            .order_by(
                Case(
                    When(word_prefix=True, then=0),
                    default=1,
                    output_field=IntegerField(),
                ),
                "-rank",
                "-similarity",
                "-published_at",
            )
        )

        total_blogs = blogs_qs.count()
        blogs = blogs_qs[offset : offset + limit]

        blog_results = [
            {
                "slug": b.slug,
                "title": b.title,
                "excerpt": b.excerpt or "",
                "content": "",  # not needed for row card
                "image": b.featured_image.url if b.featured_image else None,
                "category": b.category.name if b.category else "General",
                "author": b.author.username if b.author else "Editorial",
                "date": (
                    b.published_at.strftime("%b %d, %Y") if b.published_at else ""
                ),
                "views": b.view_count or 0,
                "rating": 0,  # blogs don't have ratings yet
                "reviewCount": 0,  # safe default
            }
            for b in blogs
        ]

        # =====================================================
        # COMPANY SEARCH (LOGIC UNCHANGED)
        # =====================================================
        companies_qs = (
            Company.objects.filter(is_active=True)
            .annotate(
                similarity=(
                    TrigramSimilarity("name", q) if allow_trigram else Value(0.0)
                ),
                word_prefix=RawSQL("name ~* %s", [rf"\m{q}"]),
            )
            .filter(
                Q(word_prefix=True) | (Q(similarity__gt=0.45) if allow_trigram else Q())
            )
            .order_by(
                Case(
                    When(word_prefix=True, then=0),
                    default=1,
                    output_field=IntegerField(),
                ),
                "-similarity",
                "-rating_average",
                "-rating_count",
            )
        )

        total_companies = companies_qs.count()
        companies = companies_qs[offset : offset + limit]

        company_results = [
            {
                "id": c.id,
                "slug": c.slug,
                "name": c.name,
                "tagline": c.tagline,
                "rating_average": float(c.rating_average or 0),
                "rating_count": c.rating_count or 0,
                "city": c.city,
                "country": c.country,
                "logo": (request.build_absolute_uri(c.logo.url) if c.logo else None),
            }
            for c in companies
        ]

        return Response(
            {
                "query": q,
                "blogs": blog_results,
                "companies": company_results,
                "meta": {
                    "page": page,
                    "limit": limit,
                    "total_blogs": total_blogs,
                    "total_companies": total_companies,
                },
            }
        )
