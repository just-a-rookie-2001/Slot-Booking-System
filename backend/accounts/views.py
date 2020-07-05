import random

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework import generics, status, views, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response

from accounts.serializer import UserSerializer


# Disable in production
class UserView(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'admin': user.admin
        })


# class IsAdmin(views.APIView):
#     def get(self, request, email):
#         try:
#             res = get_user_model().objects.get(email=email).admin
#             return Response({"admin": res})
#         except:
#             return Response({"message": "Invalid/bad request"})


class UserRegisterView(views.APIView):
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


class ForgotPasswordView(views.APIView):
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
                subject, from_email, to = 'Slot Booking System Password Reset Token', settings.EMAIL_HOST_USER, [
                    data["email"]]
                text_content = 'Your password reset token is ' + str(token)
                html_content = render_to_string(
                    "PasswordReset.html", {'email': data["email"], 'token': token})
                msg = EmailMultiAlternatives(
                    subject, text_content, from_email, to)
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                user.save()
                return Response({"messge": "Token successfully generated"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(str(e))
            return Response({"message": "Invalid / Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class VerifyResetToken(views.APIView):
    def post(self, request):
        res, data = [], request.data
        try:
            email, token = data["email"], int(data["token"])
            user = get_user_model().objects.get(email__exact=email)
            if (user.password_reset_token == None):
                return Response({"message": "No token has been generated"}, status=status.HTTP_400_BAD_REQUEST)
            elif (user.password_reset_token == token):
                return Response({"message": "Token Verified"}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({"message": "Incorrect Token"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        except:
            return Response({"message": "Invalid / Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class ChangePassword(views.APIView):
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
