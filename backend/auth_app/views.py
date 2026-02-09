# auth_app/views.py

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from company.models import CompanyMembership

from .authentication import JWTAuthenticationFromCookie
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)

User = get_user_model()


# ==========================
# AUTH CORE
# ==========================

class ProtectedView(APIView):
    authentication_classes = [JWTAuthenticationFromCookie]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {"message": f"Hello {request.user.email}, you are authorized!"}
        )


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Account created successfully"},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):

    def post(self, request):
        user = authenticate(
            email=request.data.get("email"),
            password=request.data.get("password"),
        )

        if not user:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)

        res = Response({"detail": "Logged in"}, status=status.HTTP_200_OK)

        cookie_kwargs = {
            "httponly": True,
            "secure": True,
            "samesite": "None",
            "path": "/",
        }

        res.set_cookie("access", str(refresh.access_token), **cookie_kwargs)
        res.set_cookie("refresh", str(refresh), **cookie_kwargs)

        return res


class RefreshView(APIView):
    @method_decorator(csrf_exempt)
    def post(self, request):
        refresh = request.COOKIES.get("refresh")

        if not refresh:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            token = RefreshToken(refresh)
        except Exception:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        res = Response(status=status.HTTP_200_OK)
        res.set_cookie(
            "access",
            str(token.access_token),
            httponly=True,
            secure=True,
            samesite="None",
            path="/",
        )
        return res


class LogoutView(APIView):
    authentication_classes = [JWTAuthenticationFromCookie]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        res = Response(
            {"detail": "Logged out"},
            status=status.HTTP_200_OK,
        )

        res.delete_cookie("access", path="/", samesite="None")
        res.delete_cookie("refresh", path="/", samesite="None")

        return res


# ==========================
# USER DATA
# ==========================

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        user = request.user

        memberships = (
            CompanyMembership.objects
            .filter(user=user, status="ACTIVE")
            .select_related("company")
        )

        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "is_business": memberships.exists(),
            "mobile_number": user.mobile_number,
            "companies": [
                {
                    "company_id": m.company.id,
                    "company_slug": m.company.slug,
                    "company_name": m.company.name,
                    "role": m.role,
                }
                for m in memberships
            ],
        })


class ProfileView(APIView):
    authentication_classes = [JWTAuthenticationFromCookie]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = ProfileSerializer(
            request.user,
            context={"request": request},
        )
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


# ==========================
# PASSWORD RESET (FIXED)
# ==========================

class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()

        # DO NOT reveal user existence
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)

            reset_url = (
                f"{settings.FRONTEND_URL}/reset-password"
                f"?uid={uid}&token={token}"
            )

            email_message = EmailMultiAlternatives(
                subject="Reset your password",
                body=(
                    "Reset your password using the link below:\n\n"
                    f"{reset_url}\n\n"
                    "If you did not request this, ignore this email."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )

            email_message.send()

        return Response(
            {"detail": "If the email exists, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        password = serializer.validated_data["password"]

        user.set_password(password)
        user.save()

        return Response(
            {"detail": "Password reset successful"},
            status=status.HTTP_200_OK,
        )
