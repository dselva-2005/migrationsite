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
    def post(self, request):
        user = authenticate(
            email=request.data.get("email"), password=request.data.get("password")
        )

        if not user:
            return Response({"detail": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)

        res = Response({"detail": "Logged in"})
        res.set_cookie(
            "access",
            str(refresh.access_token),
            httponly=True,
            secure=True,
            samesite="None",
        )
        res.set_cookie(
            "refresh",
            str(refresh),
            httponly=True,
            secure=True,
            samesite="None",
        )

        return res


class RefreshView(APIView):
    def post(self, request):
        refresh = request.COOKIES.get("refresh")
        if not refresh:
            return Response(status=401)

        token = RefreshToken(refresh)
        res = Response()
        res.set_cookie(
            "access",
            str(token.access_token),
            httponly=True,
            secure=True,
            samesite="Lax",
        )
        return res


class LogoutView(APIView):
    def post(self, request):
        res = Response()
        res.delete_cookie("access")
        res.delete_cookie("refresh")
        return res

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "email": request.user.email,
            "name": request.user.get_username(),
        })
