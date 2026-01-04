from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Content
from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
)
from blog.models import BlogPost
from company.models import Company
from review.models import Review


class PageContentView(APIView):
    def get(self, request, page):
        contents = Content.objects.filter(
            page=page,
            is_published=True
        )

        data = {}
        for item in contents:
            data[item.key] = item.value

        return Response(data)


class SearchView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        q = request.query_params.get("q", "").strip()
        if not q:
            return Response({
                "blogs": [],
                "companies": []
            })

        query = SearchQuery(q)

        blogs = (
            BlogPost.objects
            .filter(status="PUBLISHED")
            .filter(search_vector=query)
            .annotate(rank=SearchRank("search_vector", query))
            .order_by("-rank")[:5]
        )

        companies = (
            Company.objects
            .filter(is_active=True)
            .filter(search_vector=query)
            .annotate(rank=SearchRank("search_vector", query))
            .order_by("-rank")[:5]
        )

        return Response({
            "blogs": [
                {"id": b.id, "title": b.title, "slug": b.slug}
                for b in blogs
            ],
            "companies": [
                {"id": c.id, "name": c.name, "slug": c.slug}
                for c in companies
            ]
        })