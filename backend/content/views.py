from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Content


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
