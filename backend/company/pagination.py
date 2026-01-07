# companies/pagination.py
from rest_framework.pagination import PageNumberPagination

class CompanyPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = "page_size"
    max_page_size = 50

class ReviewDashboardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100
