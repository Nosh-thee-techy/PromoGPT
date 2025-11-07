from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, LogoutView, BusinessCreateView, BusinessListView,PasswordResetConfirmView,PasswordResetRequestView
from django.views.generic import TemplateView

urlpatterns = [
    path("register/", RegisterView.as_view(),name="register.html"),
    path("login/", LoginView.as_view()),
    # path("login/", TemplateView.as_view(template_name="login.html")),
    path("logout/", LogoutView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),

    path("business/create/", BusinessCreateView.as_view()),
    path("business/", BusinessListView.as_view()),
    path("reset-password/", PasswordResetRequestView.as_view(),name='request.html'),
    path("reset-password-confirm/<uidb64>/<token>/", PasswordResetConfirmView.as_view(),name="reset_password.html"),
]
