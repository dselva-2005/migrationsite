from review.utils import get_company_from_review
from company.permissions import user_can_manage_company
from rest_framework.permissions import BasePermission


def can_moderate_review(user, review):
    company = get_company_from_review(review)
    if not company:
        return False

    return user_can_manage_company(user, company)


class IsCompanyOwnerOrManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        company = obj.company
        return (
            request.user == company.owner or
            request.user in company.managers.all()
        )
