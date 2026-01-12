from django.contrib import admin
from django import forms
from django.forms import Textarea
from django.utils.html import format_html
import json

from .models import Content, MediaAsset


# ----------------------------
# Pretty JSON Widget
# ----------------------------
class PrettyJSONWidget(Textarea):
    def format_value(self, value):
        if value is None:
            return ""

        if isinstance(value, str):
            try:
                value = json.loads(value)
            except Exception:
                return value

        try:
            return json.dumps(value, indent=2, ensure_ascii=False)
        except Exception:
            return str(value)


# ----------------------------
# Content Admin Form
# ----------------------------
class ContentAdminForm(forms.ModelForm):
    class Meta:
        model = Content
        fields = "__all__"
        widgets = {
            "value": PrettyJSONWidget(
                attrs={
                    "rows": 18,
                    "style": "font-family: monospace;",
                }
            )
        }

    def clean_value(self):
        value = self.cleaned_data.get("value")
        content_type = self.cleaned_data.get("content_type")

        if content_type in {"list", "object"} and isinstance(value, str):
            try:
                value = json.loads(value)
            except Exception:
                raise forms.ValidationError("Invalid JSON format.")

        if content_type == "text" and not isinstance(value, str):
            raise forms.ValidationError("Text must be a string.")

        if content_type == "list" and not isinstance(value, list):
            raise forms.ValidationError("List must be an array.")

        if content_type == "object" and not isinstance(value, dict):
            raise forms.ValidationError("Object must be a JSON object.")

        return value


# ----------------------------
# Content Admin
# ----------------------------
@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    form = ContentAdminForm

    list_display = (
        "id",
        "page",
        "key",
        "content_type",
        "locale",
        "updated_at",
    )

    list_display_links = ("id",)

    list_filter = (
        "page",
        "content_type",
        "locale",
    )

    search_fields = (
        "key",
        "page",
    )

    ordering = ("page", "order")

    fieldsets = (
        ("Identification", {
            "fields": ("page", "key", "locale"),
        }),
        ("Content", {
            "fields": ("content_type", "value"),
        }),
        ("Control", {
            "fields": ("order",),
        }),
        ("Meta", {
            "fields": ("updated_at",),
        }),
    )

    readonly_fields = ("updated_at",)

    def get_readonly_fields(self, request, obj=None):
        """
        Only `updated_at` is read-only.
        """
        return self.readonly_fields


# ----------------------------
# Media Asset Admin
# ----------------------------
@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = (
        "preview",
        "title",
        "asset_type",
        "copy_url",
        "is_published",
        "created_at",
    )

    list_filter = (
        "asset_type",
        "locale",
        "is_published",
    )

    search_fields = ("title",)

    readonly_fields = (
        "preview",
        "file_url",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "asset_type", "locale", "is_published"),
        }),
        ("File", {
            "fields": ("file", "file_url", "preview"),
        }),
        ("SEO", {
            "fields": ("alt_text",),
        }),
        ("Meta", {
            "fields": ("created_at", "updated_at"),
        }),
    )

    # ----------------------------
    # Thumbnail Preview
    # ----------------------------
    def preview(self, obj):
        if not obj.file:
            return "—"

        if obj.asset_type in {"image", "icon"}:
            return format_html(
                '<img src="{}" style="max-height:60px;border-radius:4px;" />',
                obj.file.url
            )

        return "—"

    preview.short_description = "Preview"

    # ----------------------------
    # File URL (Detail View)
    # ----------------------------
    def file_url(self, obj):
        return obj.file.url if obj.file else "—"

    file_url.short_description = "File URL"

    # ----------------------------
    # Copyable URL (List View)
    # ----------------------------
    def copy_url(self, obj):
        if not obj.file:
            return "—"

        return format_html(
            '<input type="text" value="{}" '
            'style="width:260px; font-size:12px;" '
            'onclick="this.select()" readonly />',
            obj.file.url
        )

    copy_url.short_description = "Copy URL"
