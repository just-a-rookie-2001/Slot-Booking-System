from rest_framework import serializers

from .models import Room, Booking


class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = '__all__'
        # exclude = ['start_timing', 'end_timing']


class RoomSerializer(serializers.ModelSerializer):
    bookings = BookingSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = '__all__'
