from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

@api_view(["POST"])
def send_reset_email(request):
    email = request.data.get("email")

    try:
        user = User.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        frontend_url = f"http://localhost:3000/ResetPassword/{uid}/{token}"

        send_mail(
            "Password Reset Request",
            f"Click the link below to reset your password:\n{frontend_url}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({"message": "Password reset email sent!"}, status=200)

    except User.DoesNotExist:
        return Response({"error": "Email not found!"}, status=404)
    except Exception as e:
        return Response({"error": "An error occurred!"}, status=500)

@api_view(["POST"])
def reset_password_confirm(request, uidb64, token):
    new_password = request.data.get("new_password")

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))  # Decode user ID
        user = User.objects.get(pk=uid)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token!"}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successful!"}, status=200)

    except (User.DoesNotExist, ValueError):
        return Response({"error": "Invalid user!"}, status=400)
