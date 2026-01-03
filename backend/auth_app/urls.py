from django.urls import path
from .views import LoginView, RefreshView, LogoutView, RegisterView, ProtectedView,MeView,ProfileView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("protected/", ProtectedView.as_view(), name="protected"),
    path("me/", MeView.as_view(), name="UserInfo"),
    path("profile/", ProfileView.as_view()),
]
