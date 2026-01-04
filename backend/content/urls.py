from django.urls import path
from .views import PageContentView,SearchView

urlpatterns = [
    path("search/", SearchView.as_view(), name="global-search"),
    path("<str:page>/", PageContentView.as_view()),
]
