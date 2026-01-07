from django.contrib import admin
from .models import BlogPost, BlogCategory, BlogTag
from django.contrib.contenttypes.admin import GenericTabularInline
from review.models import Review


class ReviewInline(GenericTabularInline):
    model = Review
    extra = 0
    can_delete = False

    readonly_fields = (
        "rating",
        "author_name",
        "author_email",
        "body",
        "is_verified",
        "created_at",
    )


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name",)   # ✅ REQUIRED for autocomplete
    prepopulated_fields = {"slug": ("name",)}


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    
    list_display = (
        "title",
        "author",
        "status",
        "published_at",
        "created_at",
    )

    list_filter = (
        "status",
        "category",
        "created_at",
    )

    search_fields = (
        "title",
        "excerpt",
        "content",
    )

    prepopulated_fields = {"slug": ("title",)}

    autocomplete_fields = (
        "author",
        "category",
        "tags",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "view_count",
    )

    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "slug", "author", "status")
        }),
        ("Content", {
            "fields": ("excerpt", "content", "featured_image","search_vector")
        }),
        ("Classification", {
            "fields": ("category", "tags")
        }),
        ("SEO", {
            "fields": ("seo_title", "seo_description")
        }),
        ("System", {
            "fields": ("view_count", "created_at", "updated_at")
        }),
    )

    inlines = [ReviewInline]



