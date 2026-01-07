# reviews/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.db.models import Avg, Count

from .models import Review
from company.models import Company


def update_company_rating(company: Company):
    content_type = ContentType.objects.get_for_model(Company)

    stats = Review.objects.filter(
        content_type=content_type,
        object_id=company.id,
        moderation_status=Review.ModerationStatus.APPROVED,
    ).aggregate(
        avg=Avg("rating"),
        count=Count("id"),
    )

    company.rating_average = round(stats["avg"] or 0, 2)
    company.rating_count = stats["count"] or 0

    company.save(update_fields=["rating_average", "rating_count"])


@receiver(post_save, sender=Review)
def on_review_save(sender, instance, **kwargs):
    if isinstance(instance.content_object, Company):
        update_company_rating(instance.content_object)


@receiver(post_delete, sender=Review)
def on_review_delete(sender, instance, **kwargs):
    if isinstance(instance.content_object, Company):
        update_company_rating(instance.content_object)
