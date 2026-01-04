from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from auth_app.models import User
from review.models import Review

# review/tasks.py
@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=30)
def send_review_approved_email(self, user_id, review_id):
    user = User.objects.get(id=user_id)
    review = Review.objects.get(id=review_id)

    subject = "Your review has been approved"
    message = (
        f"Hi {user.username},\n\n"
        "Your review has been approved and is now visible publicly.\n\n"
        "Thank you for your feedback!"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
