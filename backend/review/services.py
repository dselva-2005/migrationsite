from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator

from .models import Review



def get_reviews_for_object(*, obj, page=1, page_size=10):
    """
    Generic review fetcher for ANY model (Company, Blog, Product, etc.)
    """

    content_type = ContentType.objects.get_for_model(obj, for_concrete_model=False)

    qs = (
        Review.objects
        .filter(
            content_type=content_type,
            object_id=obj.id,
            is_approved=True,
        )
        .select_related("content_type")
        .order_by("-created_at")
    )

    paginator = Paginator(qs, page_size)
    page_obj = paginator.get_page(page)

    return {
        "count": paginator.count,
        "num_pages": paginator.num_pages,
        "results": page_obj.object_list,
    }
