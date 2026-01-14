from django.urls import path
from .views import PageContentView,SearchView,FullSearchView

urlpatterns = [
    path("search/", SearchView.as_view(), name="global-search"),
    path("full-search/", FullSearchView.as_view(), name="global-search-full"),
    path("<str:page>/", PageContentView.as_view()),
]
