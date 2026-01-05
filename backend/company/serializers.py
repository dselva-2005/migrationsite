# companies/serializers.py
from review.serializers import ReviewDashboardSerializer
from rest_framework import serializers
from .models import Company, CompanyOnboardingRequest


class CompanyListSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "city",
            "slug",
            "tagline",
            "logo",
            "rating_average",
            "rating_count",
            "is_verified",
            "category",
        ]


class CompanyDetailSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()

    class Meta:
        model = Company
        fields = [
            # Core
            "id",
            "name",
            "slug",
            "tagline",
            "description",
            "website",

            # Branding
            "logo",
            "cover_image",

            # Address & contact
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "postal_code",
            "country",
            "phone",
            "email",

            # Meta
            "rating_average",
            "rating_count",
            "is_verified",
            "category",
            "created_at",
        ]


class CompanyPayloadSerializer(serializers.Serializer):
    exists = serializers.BooleanField()
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), required=False, allow_null=True
    )

    name = serializers.CharField(required=False, allow_blank=True)
    tagline = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_null=True)


class BusinessOnboardingSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    phone = serializers.CharField()
    role = serializers.ChoiceField(choices=["OWNER", "MANAGER"])

    request_type = serializers.ChoiceField(choices=["NEW", "EXISTING"])

    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        required=False,
        allow_null=True,
        source="company",
    )

    # Company snapshot
    company_name = serializers.CharField(required=False, allow_blank=True)
    tagline = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)

    # ✅ Address snapshot
    address_line_1 = serializers.CharField(required=False, allow_blank=True)
    address_line_2 = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    postal_code = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    def validate(self, data):
        request_type = data["request_type"]
        company = data.get("company")

        if request_type == "EXISTING" and not company:
            raise serializers.ValidationError(
                "company_id is required for existing company"
            )

        if request_type == "NEW" and not data.get("company_name"):
            raise serializers.ValidationError(
                "company_name is required for new company"
            )

        return data

    def create(self, validated_data):
        user = self.context["request"].user

        return CompanyOnboardingRequest.objects.create(
            user=user,
            request_type=validated_data["request_type"],
            company=validated_data.get("company"),

            company_name=validated_data.get("company_name", ""),
            tagline=validated_data.get("tagline", ""),
            description=validated_data.get("description", ""),
            website=validated_data.get("website", ""),

            # ✅ Address snapshot
            address_line_1=validated_data.get("address_line_1", ""),
            address_line_2=validated_data.get("address_line_2", ""),
            city=validated_data.get("city", ""),
            state=validated_data.get("state", ""),
            postal_code=validated_data.get("postal_code", ""),
            country=validated_data.get("country", ""),
            phone=validated_data.get("phone_number", ""),
            email=validated_data.get("email", ""),
        )


class CompanyListInfo(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
        ]


class CompanyDashboardSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "slug",
            "rating_average",
            "rating_count",
            "is_verified",
            "logo",
            "reviews",
        ]

    def get_reviews(self, company):
        from django.contrib.contenttypes.models import ContentType
        from review.models import Review

        ct = ContentType.objects.get_for_model(Company)

        qs = Review.objects.filter(
            content_type=ct,
            object_id=company.id,
        ).order_by("-created_at")

        return ReviewDashboardSerializer(
            qs,
            many=True,
            context=self.context,
        ).data


class CompanyLogoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["logo"]

    def validate_logo(self, value):
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("Logo size must be under 2MB")

        if value.content_type not in ["image/png", "image/jpeg", "image/webp"]:
            raise serializers.ValidationError("Unsupported image format")

        return value
