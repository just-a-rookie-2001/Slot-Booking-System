import uuid
import datetime
from django.db import models

from django.conf import settings


class Room(models.Model):
    SCHOOL_CHOICES = [
        ("SEAS", "School of Engineering and Applied Sciences"),
        ("SAS", "School of Arts and Sciences"),
        ("AMSOM", "Amrut Mody School of Management"),
        ("BLS", "Biological Life Sciences"),
        ("SCS","School of Computer Studies"),
        ("NULL", "UNASSIGNED"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room_number = models.IntegerField(null=False, blank=False)
    room_name = models.CharField(max_length=255)
    school = models.CharField(max_length=10, choices=SCHOOL_CHOICES, default="NULL")
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return "{0} - {1}".format(self.room_number, self.room_name)


class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    Room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="bookings")
    booking_date = models.DateField(default=datetime.date.today)
    start_timing = models.TimeField()
    end_timing = models.TimeField()
    purpose_of_booking = models.TextField()
    is_pending = models.BooleanField(default=False)
    admin_did_accept = models.BooleanField(default=False)
    admin_feedback = models.TextField(blank=True, null=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "From: {0} - To: {1}".format(self.start_timing, self.end_timing)