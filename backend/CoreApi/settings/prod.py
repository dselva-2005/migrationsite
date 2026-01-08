from .base import *
import os

DEBUG = False

DOMAIN = os.environ.get("DOMAIN")

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

CSRF_TRUSTED_ORIGINS += [
    f"https://{DOMAIN}",
    f"https://www.{DOMAIN}",
]

CORS_ALLOWED_ORIGINS += [
    f"https://{DOMAIN}",
    f"https://www.{DOMAIN}",
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

REST_FRAMEWORK.update({"DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
    )})

# Ensure uploaded files are writable by the shared group
FILE_UPLOAD_PERMISSIONS = 0o664
FILE_UPLOAD_DIRECTORY_PERMISSIONS = 0o775
