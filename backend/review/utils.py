from django.contrib.contenttypes.models import ContentType
from company.models import Company


def get_company_from_review(review):
    if isinstance(review.content_object, Company):
        return review.content_object
    return None
