# blog/serializers.py
from rest_framework import serializers
from .models import BlogPost


class BlogPostBaseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    category = serializers.CharField(source="category.name")
    author = serializers.CharField(source="author.username")
    date = serializers.DateTimeField(source="published_at")
    views = serializers.IntegerField(source="view_count")

    rating = serializers.FloatField(read_only=True)
    reviewCount = serializers.IntegerField(read_only=True)

    class Meta:
        model = BlogPost
        fields = (
            "slug",
            "title",
            "excerpt",
            "image",
            "category",
            "author",
            "date",
            "views",
            "rating",
            "reviewCount",
        )

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.featured_image and request:
            return request.build_absolute_uri(obj.featured_image.url)
        elif obj.featured_image:
            return obj.featured_image.url  # fallback to relative
        return None


class BlogPostListSerializer(BlogPostBaseSerializer):
    """Used for blog listing"""
    pass


class BlogPostDetailSerializer(BlogPostBaseSerializer):
    """Used for single blog view"""
    content = serializers.CharField()
    seo_title = serializers.CharField()
    seo_description = serializers.CharField()

    class Meta(BlogPostBaseSerializer.Meta):
        fields = BlogPostBaseSerializer.Meta.fields + (
            "content",
            "seo_title",
            "seo_description",
        )
