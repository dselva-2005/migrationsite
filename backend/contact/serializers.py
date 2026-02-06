from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Serializer for CMS-driven contact forms.
    Accepts dynamic fields and normalizes core data.
    """

    class Meta:
        model = ContactMessage
        fields = (
            "id",
            "name",
            "email",
            "phone",
            "message",
            "extra_data",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def to_internal_value(self, data):
        """
        Separate known fields from dynamic CMS fields.
        """
        known_fields = {"name", "email", "phone", "message"}

        core_data = {}
        extra_data = {}

        for key, value in data.items():
            if key in known_fields:
                core_data[key] = value
            else:
                extra_data[key] = value

        core_data["extra_data"] = extra_data or None
        return super().to_internal_value(core_data)

    def validate_email(self, value):
        return value.lower().strip()

    def validate_name(self, value):
        return value.strip()
