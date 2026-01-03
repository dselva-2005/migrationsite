# auth_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from .authentication import JWTAuthenticationFromCookie
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from company.models import CompanyMembership
from .serializers import ProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser


class ProtectedView(APIView):
    authentication_classes = [JWTAuthenticationFromCookie]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Hello {request.user.email}, you are authorized!"})

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
    @method_decorator(csrf_exempt)
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

        res = Response({"detail": "Logged in"}, status=200)

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

        res = Response(status=200)
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
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthenticationFromCookie]

    @method_decorator(csrf_exempt)
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        # Invalidate refresh token (SimpleJWT)
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

        cookie_kwargs = {
            "path": "/",
            "samesite": "None",
        }

        res.delete_cookie("access", **cookie_kwargs)
        res.delete_cookie("refresh", **cookie_kwargs)

        return res
    

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        memberships = (
            CompanyMembership.objects
            .filter(
                user=user,
                status="ACTIVE",
            )
            .select_related("company")
        )

        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,

            # Business user if at least one active company
            "is_business": memberships.exists(),

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
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "profile_image_url": (
                user.profile_image.url if user.profile_image else None
            ),
        })

    def patch(self, request):
        user = request.user

        username = request.data.get("username")
        image = request.FILES.get("profile_image")

        if username:
            user.username = username

        if image:
            user.profile_image = image

        user.save()

        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "profile_image_url": (
                user.profile_image.url if user.profile_image else None
            ),
        })

    authentication_classes = [JWTAuthenticationFromCookie]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

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