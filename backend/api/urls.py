from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register, LoginView, summarize_text, send_reset_email, reset_password_confirm,summarize_points


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('summarize/', summarize_text, name='summarize'),
    path("send_reset_email/", send_reset_email, name="send_reset_email"),
    path("reset-password-confirm/<uidb64>/<token>/", reset_password_confirm, name="password_reset_confirm"),
    path('summarize_points/', summarize_points, name='summarize_points'),
    #path('upload_pdf/', upload_pdf, name='upload_pdf'),
    #path('ask_question/', ask_question, name='ask_question'),

]
