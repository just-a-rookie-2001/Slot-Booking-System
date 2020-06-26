from django.contrib import admin
from .models import Booking, Room

admin.site.register([Room, Booking])