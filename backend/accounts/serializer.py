from django.contrib.auth import get_user_model
from rest_framework import serializers

from BookingSystem.serializer import BookingSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'name', 'user_type', 'workplace', 'admin', 'bookings', 'password']
    
    bookings = BookingSerializer(many=True, read_only=True)
    password = serializers.CharField(write_only=True)
    admin = serializers.BooleanField(read_only=True)

    def create(self, validated_data):
            user = get_user_model().objects.create(
                email=validated_data['email'],
                name=validated_data["name"],
                user_type=validated_data["user_type"],
                workplace=validated_data["workplace"],
            )
            user.set_password(validated_data['password'])
            user.save()
            return user

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        try:
            user.set_password(validated_data['password'])
            user.save()
        except KeyError:
            pass
        return user