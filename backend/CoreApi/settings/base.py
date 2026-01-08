"""
Base Django settings for CoreApi.
Shared between dev & prod.
"""

from pathlib import Path
import os
from datetime import timedelta

# --------------------------------------------------
# Base directory
# --------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# --------------------------------------------------
# Core security
# --------------------------------------------------
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")

DEBUG = False  # overridden in dev.py

ALLOWED_HOSTS = os.environ.get(
    "ALLOWED_HOSTS",
    "localhost,127.0.0.1"
).split(",")

# --------------------------------------------------
# CSRF
# --------------------------------------------------
CSRF_TRUSTED_ORIGINS = [
    origin
    for origin in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")
    if origin
]

# --------------------------------------------------
# Applications
# --------------------------------------------------
INSTALLED_APPS = [
    "jazzmin",

    "django.contrib.admin",
    "django.contrib.postgres",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",

    "auth_app",
    "content",
    "company",
    "review",
    "blog",
]

# --------------------------------------------------
# Middleware
# --------------------------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware"
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# --------------------------------------------------
# URLs / WSGI
# --------------------------------------------------
ROOT_URLCONF = "CoreApi.urls"
WSGI_APPLICATION = "CoreApi.wsgi.application"

# --------------------------------------------------
# Templates
# --------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# --------------------------------------------------
# Database
# --------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME"),
        "USER": os.environ.get("DB_USER"),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST": os.environ.get("DB_HOST", "postgres"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}

# --------------------------------------------------
# Password validation
# --------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --------------------------------------------------
# Internationalization
# --------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --------------------------------------------------
# Static & Media
# --------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# --------------------------------------------------
# Default primary key
# --------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --------------------------------------------------
# Custom User
# --------------------------------------------------
AUTH_USER_MODEL = "auth_app.User"

# --------------------------------------------------
# CORS
# --------------------------------------------------
CORS_ALLOWED_ORIGINS = [
    origin
    for origin in os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")
    if origin
]

CORS_ALLOW_CREDENTIALS = True

# --------------------------------------------------
# REST + JWT
# --------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "auth_app.authentication.JWTAuthenticationFromCookie",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=int(os.environ.get("ACCESS_TOKEN_LIFETIME_MINUTES", 5))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=int(os.environ.get("REFRESH_TOKEN_LIFETIME_DAYS", 7))
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# --------------------------------------------------
# Redis Cache + Sessions
# --------------------------------------------------
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.environ.get("REDIS_URL"),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
        "KEY_PREFIX": "coreapi",
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"

# --------------------------------------------------
# Celery
# --------------------------------------------------
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"

# --------------------------------------------------
# Frontend
# --------------------------------------------------
FRONTEND_URL = os.environ.get("FRONTEND_URL")

# --------------------------------------------------
# Email
# --------------------------------------------------
EMAIL_BACKEND = os.environ.get("EMAIL_BACKEND")
EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "False") == "True"
EMAIL_USE_SSL = os.environ.get("EMAIL_USE_SSL", "False") == "True"
EMAIL_SUBJECT_PREFIX = os.environ.get("EMAIL_SUBJECT_PREFIX", "")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL")

# --------------------------------------------------
# App constants
# --------------------------------------------------
MAX_MEDIA_PER_REVIEW = 5

# --------------------------------------------------
# Jazzmin
# --------------------------------------------------
JAZZMIN_SETTINGS = {
    "site_title": "Admin Panel",
    "site_header": "Admin Dashboard",
    "site_brand": "My Project",
    "welcome_sign": "Welcome to the Admin Panel",
    "copyright": "© 2026 My Company",
    "show_sidebar": True,
    "navigation_expanded": True,
    "theme": "darkly",
}

JAZZMIN_SETTINGS["icons"] = {
    "auth": "fas fa-users-cog",
    "auth.user": "fas fa-user",
    "auth.Group": "fas fa-users",
    "review.Review": "fas fa-star",
    "company.Company": "fas fa-building",
}

# --------------------------------------------------
# Upload limits
# --------------------------------------------------
DATA_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024
