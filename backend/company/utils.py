from django.db.models import Avg, Count
from django.contrib.contenttypes.models import ContentType
from review.models import Review
from company.models import Company


def recalculate_company_rating(company):
    ct = ContentType.objects.get_for_model(Company)

    stats = Review.objects.filter(
        content_type=ct,
        object_id=company.id,
        is_approved=True,
    ).aggregate(
        avg=Avg("rating"),
        count=Count("id"),
    )

    company.rating_average = stats["avg"] or 0
    company.rating_count = stats["count"]
    company.save(update_fields=["rating_average", "rating_count"])
