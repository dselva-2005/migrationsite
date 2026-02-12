# company/models.py
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.fields import GenericRelation
from django.core.exceptions import ValidationError
from auth_app.models import User
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField


class CompanyCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Company Categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Company(models.Model):
    view_count = models.PositiveBigIntegerField(default=0)
    display_order = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Lower number = higher priority in listings"
    )

    address_line_1 = models.CharField(max_length=255, blank=True)
    address_line_2 = models.CharField(max_length=255, blank=True)

    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)

    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    # --------------------
    # Ownership
    # --------------------
    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="companies"
    )

    # --------------------
    # Core Identity
    # --------------------
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)

    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    # --------------------
    # Branding
    # --------------------
    logo = models.ImageField(upload_to="companies/logos/", blank=True, null=True)
    cover_image = models.ImageField(
        upload_to="companies/covers/", blank=True, null=True
    )

    website = models.URLField(blank=True)

    # --------------------
    # Classification
    # --------------------
    category = models.ForeignKey(
        CompanyCategory, on_delete=models.SET_NULL, null=True, related_name="companies"
    )

    # --------------------
    # Review Aggregates
    # --------------------
    rating_average = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    rating_count = models.PositiveIntegerField(default=0)

    reviews = GenericRelation("review.Review", related_query_name="company")

    # --------------------
    # Trust & Visibility
    # --------------------
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # --------------------
    # SEO
    # --------------------
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.CharField(max_length=500, blank=True)

    # --------------------
    # Timestamps
    # --------------------
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    search_vector = SearchVectorField(null=True)  # <-- Postgres full-text

    class Meta:
        ordering = ["display_order","-rating_average", "-rating_count"]
        indexes = [
            GinIndex(fields=["search_vector"]),
            GinIndex(
                fields=["name"],
                name="company_name_trgm",
                opclasses=["gin_trgm_ops"],
            ),
            GinIndex(
                fields=["tagline"],
                name="company_tagline_trgm",
                opclasses=["gin_trgm_ops"],
            ),
            models.Index(fields=["slug"]),
            models.Index(fields=["rating_average"]),
            models.Index(fields=["rating_count"]),
            models.Index(fields=["is_verified"]),
            models.Index(
                fields=["name"],
                name="company_name_prefix",
                opclasses=["text_pattern_ops"],
            ),
            models.Index(fields=["display_order"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            i = 1
            while Company.objects.filter(slug=slug).exists():
                slug = f"{base}-{i}"
                i += 1
            self.slug = slug

        self.updated_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CompanyOnboardingRequest(models.Model):
    REQUEST_TYPE_CHOICES = (
        ("NEW", "New Company"),
        ("EXISTING", "Existing Company"),
    )

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    )

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="onboarding_requests"
    )

    request_type = models.CharField(max_length=10, choices=REQUEST_TYPE_CHOICES)

    # Existing company (only if EXISTING)
    company = models.ForeignKey(
        Company, on_delete=models.SET_NULL, null=True, blank=True
    )

    # New company snapshot (only if NEW)
    company_name = models.CharField(max_length=255, blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")

    reviewed_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reviewed_onboarding_requests",
    )

    reviewed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)

    # --------------------
    # Address snapshot
    # --------------------
    address_line_1 = models.CharField(max_length=255, blank=True)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)

    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    def __str__(self):
        return f"{self.user} → {self.request_type}"

    def clean(self):
        if self.request_type == "NEW" and self.company:
            raise ValidationError(
                "New company request cannot reference existing company"
            )

        if self.request_type == "EXISTING" and not self.company:
            raise ValidationError("Existing company request must reference a company")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class CompanyMembership(models.Model):
    ROLE_CHOICES = (
        ("OWNER", "Owner"),
        ("MANAGER", "Manager"),
        ("EMPLOYEE", "Employee"),
    )

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("ACTIVE", "Active"),
        ("REVOKED", "Revoked"),
    )

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="company_memberships"
    )

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="memberships"
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")

    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("user", "company")

    def __str__(self):
        return f"{self.user} @ {self.company}"

class CompanySuggestion(models.Model):
    company_name = models.CharField(max_length=255, db_index=True)
    website = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField(blank=True)

    # Proper secure user relation
    submitted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="company_suggestions"
    )

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    is_reviewed = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Company Registration Form"
        verbose_name_plural = "Company Registration Forms"

    def __str__(self):
        return self.company_name