from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str, smart_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings

from django.contrib.auth.hashers import make_password
from .models import User


from .models import Business,BusinessMember
from .serializers import RegisterSerializer,Userserializer,BusinessSerializer

class RegisterView(APIView):
    permission_classes=[permissions.AllowAny]

    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            refresh=RefreshToken.for_user(user)
            return Response({
                'user':Userserializer(user).data,
                "refresh":str(refresh),
                'access':str(refresh.access_token),

            },stats=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    permission_classes=[permissions.AllowAny]

    def post(self,request):
        user=authenticate(
            email=request.data.get("email"),
            password=request.data.get('password')
        )

        if not user:
            return Response({"error":"Invalid credentials"},status=status.HTTP_401_UNAUTHORIZED)
        
        refresh=RefreshToken.for_user(user)
        return Response({
            'user':Userserializer(user).data,
            'refresh':str(refresh),
            'access':str(refresh.access_token)
        })
    

class LogoutView(APIView):
    def post(self,request):
        refresh_token=request.data.get("refresh")
        if not refresh_token:
            return Response({"error":"Refresh token required"},status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(refresh_token).blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class BusinessCreateView(APIView):
    def post(self, request):
        serializer = BusinessSerializer(data=request.data)
        if serializer.is_valid():
            business = serializer.save(owner=request.user)
            BusinessMember.objects.create(business=business, user=request.user, role="owner")
            return Response(BusinessSerializer(business).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BusinessListView(APIView):
    def get(self, request):
        businesses = Business.objects.filter(owner=request.user)
        return Response(BusinessSerializer(businesses, many=True).data)
        
        


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        
        # Response should be same for both existence and non-existence of user
        # to prevent attackers confirming valid emails
        if user:
            token = PasswordResetTokenGenerator().make_token(user)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))

            reset_url = f"http://localhost:8000/api/users/reset-password-confirm/{uidb64}/{token}/"

            send_mail(
                subject="Reset Your Password",
                message=f"Click here to reset your password:\n{reset_url}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )

        return Response(
            {"message": "If the email exists, password reset instructions have been sent."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, uidb64, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
        except Exception:
            return Response({"error": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("password")
        if not new_password or len(new_password) < 8:
            return Response({"error": "Password must be at least 8 characters"},
                            status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Password reset successful!"})

    
