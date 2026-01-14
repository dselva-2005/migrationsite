# blog/serializers.py
from rest_framework import serializers
from .models import BlogPost
from .models import BlogCategory


class BlogPostBaseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
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
        if obj.featured_image:
            return (
                request.build_absolute_uri(obj.featured_image.url)
                if request else obj.featured_image.url
            )
        return None

    def get_category(self, obj):
        return obj.category.name if obj.category else "General"

    def get_author(self, obj):
        return obj.author.username if obj.author else "Editorial"

    def get_date(self, obj):
        return obj.published_at.strftime("%b %d, %Y") if obj.published_at else ""



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


class BlogCategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = BlogCategory
        fields = (
            "id",
            "name",
            "slug",
            "post_count",
        )
