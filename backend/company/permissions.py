from company.models import CompanyMembership


def user_can_manage_company(user, company):
    if not user or not user.is_authenticated:
        return False

    return CompanyMembership.objects.filter(
        user=user,
        company=company,
        status="ACTIVE",
        role__in=["OWNER", "MANAGER"],
    ).exists()
