from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view 

# Generate JWT Token
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }
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


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

# Load model only once for efficiency
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Protect this API with JWT authentication
def summarize_text(request):
    data = request.data
    text = data.get("text", "").strip().replace("  ", " ")
    min_length = int(data.get("min_length", 50))

    if not text:
        return Response({"error": "Text is required"}, status=400)

    inputs = tokenizer(text, max_length=1024, truncation=True, return_tensors="pt")
    
    with torch.no_grad():
        summary_ids = model.generate(
            inputs["input_ids"],
            max_length=250,
            min_length=min_length,
            num_beams=4,
            early_stopping=True,
        )

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return Response({"summary": summary})


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


