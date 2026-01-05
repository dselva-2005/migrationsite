from .base import *
import os

DEBUG = False

DOMAIN = os.environ.get("DOMAIN")

ALLOWED_HOSTS = [DOMAIN]

CSRF_TRUSTED_ORIGINS += [
    f"https://{DOMAIN}",
]

CORS_ALLOWED_ORIGINS += [
    f"https://{DOMAIN}",
]

# --------------------------------------------------
# HTTPS & Security
# --------------------------------------------------
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
