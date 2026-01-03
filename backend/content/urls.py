from django.urls import path
from .views import PageContentView

urlpatterns = [
    path("<str:page>/", PageContentView.as_view())
]

