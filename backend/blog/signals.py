# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.postgres.search import SearchVector
from blog.models import BlogPost
from company.models import Company
from review.models import Review

@receiver(post_save, sender=BlogPost)
def update_blog_search_vector(sender, instance, **kwargs):
    BlogPost.objects.filter(pk=instance.pk).update(
        search_vector=(
            SearchVector("title", weight="A") +
            SearchVector("excerpt", weight="B") +
            SearchVector("content", weight="C")
        )
    )

@receiver(post_save, sender=Company)
def update_company_search_vector(sender, instance, **kwargs):
    Company.objects.filter(pk=instance.pk).update(
        search_vector=(
            # Core identity
            SearchVector("name", weight="A") +
            SearchVector("tagline", weight="A") +
            SearchVector("description", weight="B") +

            # Address / Contact
            SearchVector("address_line_1", weight="C") +
            SearchVector("address_line_2", weight="C") +
            SearchVector("city", weight="B") +
            SearchVector("state", weight="C") +
            SearchVector("postal_code", weight="D") +
            SearchVector("country", weight="B")
        )
    )


@receiver(post_save, sender=Review)
def update_review_search_vector(sender, instance, **kwargs):
    Review.objects.filter(pk=instance.pk).update(
        search_vector=(
            SearchVector("title", weight="A") +
            SearchVector("body", weight="B") +
            SearchVector("author_name", weight="C")
        )
    )