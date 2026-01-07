from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template import Template, Context

from auth_app.models import User
from review.models import Review, EmailTemplate


def render_template(template: str, context: dict) -> str:
    return Template(template).render(Context(context))


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=30)
def send_review_approved_email(self, user_id, review_id):
    user = User.objects.get(id=user_id)
    Review.objects.get(id=review_id)

    tpl = EmailTemplate.objects.get(key="review_approved")

    send_mail(
        subject=tpl.subject,
        message=render_template(tpl.body, {"username": user.username}),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=30)
def send_review_rejected_email(self, user_id, review_id):
    user = User.objects.get(id=user_id)
    Review.objects.get(id=review_id)

    tpl = EmailTemplate.objects.get(key="review_rejected")

    send_mail(
        subject=tpl.subject,
        message=render_template(tpl.body, {"username": user.username}),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
