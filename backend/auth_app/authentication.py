from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

class JWTAuthenticationFromCookie(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get("access")
        if not raw_token:
            return None  # unauthenticated

        try:
            validated_token = self.get_validated_token(raw_token)
        except InvalidToken:
            return None  # or raise AuthenticationFailed("Invalid token")

        user = self.get_user(validated_token)
        return (user, validated_token)

