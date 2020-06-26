import random
from django.core.mail import EmailMultiAlternatives
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status, generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.contrib.auth import get_user_model
from accounts.serializer import UserSerializer


class UserView(ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class UserRegisterView(APIView):
    def post(self, request):
        res, data = [], request.data
        if get_user_model().objects.filter(email__exact=data["email"]).exists():
            return Response({"message": "This account already exists. Please login"}, status.HTTP_409_CONFLICT)
        try:
            get_user_model().objects.create_user(
                email=data["email"],
                name=data["name"],
                user_type=data["user_type"],
                workplace=data["workplace"],
                password=data["password"])
            return Response({"message": "User successfully created"}, status=status.HTTP_201_CREATED)
        except:
            return Response({"message": "Invalid / Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    def post(self, request):
        res, data = [], request.data
        try:
            user = get_user_model().objects.filter(email__exact=data["email"])
            if not user.exists():
                return Response({"message": "This user does not exist"}, status.HTTP_404_NOT_FOUND)
            else:
                user = user.first()
                token = random.randrange(100000, 1000000, 1)
                user.password_reset_token = token

                subject, from_email, to = 'Slot Booking System Password Reset Token', settings.EMAIL_HOST_USER, [data["email"]]
                text_content = 'Your password reset token is ' + str(token)
                html_content = "<!DOCTYPE html><html><head></head><body><center><div style='background-color:#f8f8f8; width:500px; height:200px'><div style='background-color:#00e58b; width:500px; height:50px'><h3 style='color:white; padding-top:10px;'>Slot Booking System </h3></div><p style='color:gray; margin-left:-300px;'>Hello " + \
                    data["email"] + ",</p><br><p style='color:gray; margin-top:-10px;'>" + str(
                        token) + "  is your One Time Password.Do NOT share this code with anyone for security reasons.</p><div></center></body></html>"
                msg = EmailMultiAlternatives(subject, text_content, from_email, to)
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                user.save()
                return Response({"messge": "Token successfully generated"}, status=status.HTTP_201_CREATED)
        except:
            return Response({"message": "Invalid / Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class VerifyResetToken(APIView):
    def post(self, request):
        res, data = [], request.data
        try:
            email, token = data["email"], int(data["token"])
            user = get_user_model().objects.get(email__exact=email)
            if (user.password_reset_token == None):
                return Response({"message": "No token has been generated"}, status=status.HTTP_400_BAD_REQUEST)
            elif (user.password_reset_token == token):
                return Response({"message":"Token Verified"}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({"message": "Incorrect Token"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        except:
            return Response({"message": "Invalid / Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class ChangePassword(APIView):
    def post(self, request):
        res, data = [], request.data
        try:
            email, password = data["email"], data["password"]
            user = get_user_model().objects.filter(email__exact=data["email"])
            if not user.exists():
                return Response({"message": "This user does not exist"}, status.HTTP_404_NOT_FOUND)
            user = user.first()
            if (not user.password_reset_token):
                return Response({"message": "Not allowed"}, status.HTTP_401_UNAUTHORIZED)
            else:
                user.password_reset_token = None
                user.set_password(password)
                user.save()
                return Response({"message": "Password change successfull"}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Invalid / Bad request"}, status=status.HTTP_400_BAD_REQUEST)
