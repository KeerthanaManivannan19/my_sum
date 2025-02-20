from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

# Generate JWT Token
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            token = get_tokens_for_user(user)
            return Response({"token": token}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def register(request):
    data = request.data
    if User.objects.filter(username=data["username"]).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=data["email"]).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if data["password"] != data["confirmPassword"]:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=data["username"], email=data["email"], password=data["password"])
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
