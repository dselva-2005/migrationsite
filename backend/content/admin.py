from django.contrib import admin
from django import forms
from django.db import models
from django.forms import Textarea
from django.utils.safestring import mark_safe
import json

from .models import Content

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
            return value

class ContentAdminForm(forms.ModelForm):
    class Meta:
        model = Content
        fields = "__all__"
        widgets = {
            "value": PrettyJSONWidget(
                attrs={
                    "rows": 18,
                    "style": "font-family: monospace;"
                }
            )
        }
    def clean_value(self):
        value = self.cleaned_data.get("value")
        content_type = self.cleaned_data.get("content_type")

        if isinstance(value, str) and content_type in {"list", "object", "image"}:
            try:
                value = json.loads(value)
            except Exception:
                raise forms.ValidationError(
                    "Invalid JSON format."
                )

        if content_type == "text" and not isinstance(value, str):
            raise forms.ValidationError("Text must be a string.")

        if content_type == "list" and not isinstance(value, list):
            raise forms.ValidationError("List must be an array.")

        if content_type == "object" and not isinstance(value, dict):
            raise forms.ValidationError("Object must be a JSON object.")

        return value

@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    form = ContentAdminForm

    list_display = (
        "key",
        "page",
        "content_type",
        "locale",
        "is_published",
        "updated_at",
    )

    list_filter = (
        "page",
        "content_type",
        "locale",
        "is_published",
    )

    search_fields = (
        "key",
        "page",
    )

    ordering = ("page", "order")

    list_editable = ("is_published",)

    fieldsets = (
        ("Identification", {
            "fields": ("page", "key", "locale"),
        }),
        ("Content", {
            "fields": ("content_type", "value"),
        }),
        ("Control", {
            "fields": ("is_published", "order"),
        }),
        ("Meta", {
            "fields": ("updated_at",),
        }),
    )

    readonly_fields = ("updated_at",)

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ("key", "page")
        return self.readonly_fields

    formfield_overrides = {
        models.JSONField: {
            "widget": PrettyJSONWidget(
                attrs={
                    "rows": 18,
                    "style": "font-family: monospace;"
                }
            )
        }
    }
