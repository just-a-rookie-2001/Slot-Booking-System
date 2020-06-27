import datetime
import uuid
from django.db.models import Sum, Max, Min, Avg, Count
from rest_framework import status, generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.contrib.auth import get_user_model
from BookingSystem.models import Room, Booking
from .serializer import RoomSerializer, BookingSerializer


# viewsets
class RoomsView(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class BookingListCreateView(APIView):
    querySet = Booking.objects.all()
    serializer = BookingSerializer


class BookingsView(ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


# individual views
class BookingFilterView(APIView):
    def post(self, request):
        try:
            res, date, roomID = [], request.data["date"], request.data["roomId"]
            # roomInterval = Room.objects.get(id=roomID).interval_length
            # if roomInterval == 30:
            #     slot = 1
            # elif roomInterval == 60:
            #     slot = 2
            # elif roomInterval == 90:
            #     slot = 3
            for item in Booking.objects.filter(booking_date__exact=date, Room__exact=roomID).order_by('start_timing', '-admin_did_accept', '-is_pending').distinct('start_timing'):
                x = {"start_timing": item.start_timing,
                     "end_timing": item.end_timing,
                     "admin_did_accept": item.admin_did_accept,
                     "is_pending": item.is_pending}
                res.append(x)
            check = list(i['start_timing'] for i in res)
            for x in range(1, 25, 3):
                if x not in check:
                    res.append({"start_timing": x,
                                "end_timing": x+2,
                                "admin_did_accept": False,
                                "is_pending": False})
            return Response(sorted(res, key=lambda i: i['start_timing']))
        except:
            return Response({"message": "Invalid/Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class BookingHistory(APIView):
    def get(self, request):
        res = []
        for item in Booking.objects.all():
            x = {"id": item.id,
                 "user": item.user.email,
                 "room_name": item.Room.room_name,
                 "room_number": item.Room.room_number,
                 "booking_date": item.booking_date,
                 "start_timing": item.start_timing,
                 "end_timing": item.end_timing,
                 "admin_did_accept": item.admin_did_accept,
                 "is_pending": item.is_pending,
                 "purpose_of_booking": item.purpose_of_booking,
                 "admin_feedback": item.admin_feedback}
            res.append(x)
        return Response(res, status=status.HTTP_200_OK)


class UserPastBookingsView(APIView):
    def get(self, request, email):
        userId = get_user_model().objects.get(email=email).id
        currTime = datetime.datetime.now()
        filterTime = int((currTime.hour + (currTime.minute / 60) - 7.5) * 2)
        res = []
        for item in Booking.objects.filter(user__exact=userId, booking_date__lte=datetime.date.today(), end_timing__lt=filterTime):
            x = {"booking_date": item.booking_date,
                 "start_timing": item.start_timing,
                 "end_timing": item.end_timing,
                 "admin_did_accept": item.admin_did_accept,
                 "is_pending": item.is_pending,
                 "purpose_of_booking": item.purpose_of_booking,
                 "admin_feedback": item.admin_feedback,
                 "room_number": item.Room.room_number,
                 "room_name": item.Room.room_name
                 }
            res.append(x)
        return Response(sorted(res, key=lambda i: i['start_timing']))


class UserFutureBookingsView(APIView):
    def get(self, request, email):
        currTime = datetime.datetime.now()
        filterTime = int((currTime.hour + (currTime.minute / 60) - 7.5) * 2)
        userId = get_user_model().objects.get(email=email).id
        slot = Booking.objects.filter(user__exact=userId, booking_date__gte=datetime.date.today())
        res = []
        for item in slot.filter(booking_date__gt=datetime.date.today()).union(slot.filter(booking_date__exact=datetime.date.today(), end_timing__gte=filterTime)):
            x = {"booking_date": item.booking_date,
                 "start_timing": item.start_timing,
                 "end_timing": item.end_timing,
                 "admin_did_accept": item.admin_did_accept,
                 "is_pending": item.is_pending,
                 "purpose_of_booking": item.purpose_of_booking,
                 "admin_feedback": item.admin_feedback,
                 "room_number": item.Room.room_number,
                 "room_name": item.Room.room_name
                 }
            res.append(x)
        return Response(sorted(res, key=lambda i: i['start_timing']))


class RoomListView(APIView):
    def get(self, request):
        res = []
        for item in Room.objects.all():
            x = {"id": item.id,
                "room_name": item.room_name,
                "school": item.school,
                "room_number": item.room_number,
                "description": item.description}
            res.append(x)
        return Response(res)

    def post(self, request):
        try:
            res, data = [], request.data
            date = data["date"]
            start, end = data["start"], data["end"]
            h, m = datetime.datetime.strptime(start, "%H:%M").hour, datetime.datetime.strptime(start, "%H:%M").minute
            hr, mn = datetime.datetime.strptime(end, "%H:%M").hour, datetime.datetime.strptime(end, "%H:%M").minute
            st = int(((h + m / 60) - 7.5) * 2)
            et = int(((hr + mn / 60) - 7.5) * 2) - 1
            q = Booking.objects.filter(booking_date__exact=date, start_timing__exact=st, end_timing__exact=et)
            for item in q:
                x = {"id": item.Room.id,
                     "room_name": item.Room.room_name,
                     "school": item.Room.school,
                     "room_number": item.Room.room_number,
                     "description": item.Room.description,
                     "booking_date": item.booking_date,
                     "start_timing": item.start_timing,
                     "end_timing": item.end_timing,
                     "admin_did_accept": item.admin_did_accept,
                     "is_pending": item.is_pending}
                res.append(x)
            return Response({ each['id'] : each for each in res }.values())

        except:
                return Response({"message": "Invalid/Bad request"}, status=status.HTTP_400_BAD_REQUEST)



class BookRoomSlotView(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        try:
            res, data = [], request.data

            if (data["startTime"] not in range(1, 25, 3)) or (data["endTime"] not in range(3, 25, 3)):
                return Response({"message": "This slot does not exist. Booking not possible"})

            # if Booking.objects.filter(booking_date__exact=data["date"], start_timing__exact=data["startTime"], end_timing__exact=data["endTime"], user__email__exact=data["email"]).exclude(admin_did_accept=False, is_pending=False).count() >= 1:
            #     return Response("You have already booked this timing. You cannot book 2 slots at the same time", status.HTTP_409_CONFLICT)
            
            for item in Booking.objects.filter(booking_date__exact=data["date"], Room__exact=data["roomID"]):
                if (data["endTime"] < item.start_timing or data["startTime"] > item.end_timing):
                    # no clashes if the entire for loop doesn't break then the following else is executed
                    continue
                elif (item.admin_did_accept == True):
                    # Already booked
                    return Response({"Message": "This slot has already been booked"}, status=status.HTTP_306_RESERVED)
                else:
                    # empty slot with many bookings
                    userId = get_user_model().objects.get(email=data["email"])
                    roomId = Room.objects.get(id=uuid.UUID(data["roomID"]))
                    b = Booking.objects.create(user=userId, Room=roomId, booking_date=data["date"],
                                               start_timing=data["startTime"], end_timing=data["endTime"], purpose_of_booking=data["purpose_of_booking"], is_pending=True,)
                    return Response({"Message": "Booking has been added to the already existing queue"}, status=status.HTTP_202_ACCEPTED)
            else:
                # no clashes executed if for loop doesnt  break
                userId = get_user_model().objects.get(email=data["email"])
                roomId = Room.objects.get(id=uuid.UUID(data["roomID"]))
                b = Booking.objects.create(user=userId, Room=roomId, booking_date=data["date"],
                                           start_timing=data["startTime"], end_timing=data["endTime"],
                                           purpose_of_booking=data["purpose_of_booking"], is_pending=True,)
                return Response({"Message": "Booking has been added to the queue"}, status=status.HTTP_202_ACCEPTED)
        except:
            return Response({"message": "Invalid/Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class AdminRequestActionView(APIView):
    def get(self, request):
        response = []
        for item in Booking.objects.filter(is_pending__exact=True):
            room = Room.objects.get(id=item.Room.id)
            x = {"id": item.id,
                 "booking_date": item.booking_date,
                 "start_timing": item.start_timing,
                 "end_timing": item.end_timing,
                 "admin_did_accept": item.admin_did_accept,
                 "is_pending": item.is_pending,
                 "purpose_of_booking": item.purpose_of_booking,
                 "user": get_user_model().objects.get(email=item.user).email,
                 "room_id": room.id,
                 "room_name": room.room_name,
                 "room_number": room.room_number}
            response.append(x)
        return Response(response)

    def post(self, request):
        parser_classes = [JSONParser]
        try:
            res, data = [], request.data
            try:
                defaultMessage = data["message"]
            except:
                defaultMessage = "This request was automatically declined because it clashed with another request that was accepted. Any inconvenience is regretted."
            try:
                feedback = data["admin_feedback"]
            except:
                feedback = "Admin has not given any feedback"
            slot = Booking.objects.get(id=data["id"])
            if (data["admin_did_accept"] == False):
                slot.admin_did_accept = False
                slot.is_pending = False
                slot.admin_feedback = feedback
                slot.save()
            elif (data["admin_did_accept"] == True):
                slot.admin_did_accept = True
                slot.is_pending = False
                slot.admin_feedback = feedback
                slot.save()
                initialSlots = Booking.objects.filter(
                    booking_date__exact=slot.booking_date, Room=slot.Room).exclude(id=slot.id)
                rejectSlots = (initialSlots.filter(start_timing__gt=slot.end_timing)
                               | initialSlots.filter(end_timing__lt=slot.start_timing))
                finalSlots = initialSlots.exclude(id__in=rejectSlots).update(
                    admin_did_accept=False, is_pending=False, admin_feedback=defaultMessage)
            return Response({"message": "Action Completed"}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Invalid/Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class IsAdmin(APIView):
    def get(self, request, email):
        try:
            res = get_user_model().objects.get(email=email).admin
            return Response({"admin": res})
        except:
            return Response({"message": "Invalid/bad request"})


class UserAccountInfo(APIView):
    def get(self, request, email):
        # email = request.data["email"]
        user = get_user_model().objects.get(email=email)
        total, accepted, pending, declined = 0, 0, 0, 0
        try:
            for obj in Booking.objects.filter(user__exact=user.id):
                total += 1
                if obj.admin_did_accept:
                    accepted += 1
                elif obj.is_pending:
                    pending += 1
                else:
                    declined += 1
            res = {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "type": user.user_type,
                "total": total,
                "accepted": accepted,
                "pending": pending,
                "declined": declined,
            }
            return Response(res)
        except:
            return Response({"message": "Invalid/bad request"}, status=status.HTTP_400_BAD_REQUEST)


class AdminDashboardStats(APIView):
    def get(self, request):
        # try:
        rooms = Room.objects.all()
        bookings = Booking.objects.all()
        users = get_user_model().objects.all()
        
        count = {'users': users.count(), 'bookings': bookings.count(), 'rooms': rooms.count()}
        
        countSchool = {}
        for item in rooms.order_by('school').distinct('school').values_list('school', flat=True):
            countSchool[item] = bookings.filter(Room__school__exact=item).count()
        
        slots = {}
        for item in bookings.order_by('start_timing').distinct('start_timing').values_list('start_timing', flat=True):
            slots[item] = bookings.filter(start_timing__exact=item).count()

        # buildingSlots = []
        # print(list(item for item in bookings.annotate(c=Count('start_timing')).order_by('-c')))

        # return Response([{"count":count}, {"countSchool":countSchool}, {"slots":slots}])
        return Response([count, countSchool, slots])

        # except:
        #     return Response({"message": "Invalid/bad request"}, status=status.HTTP_400_BAD_REQUEST)

        


# class AutoActionView(APIView):
#     def get(self, request):
#         try:
#             for room in Room.objects.all():
#                 booking = Booking.objects.filter(booking_date=datetime.date.today(), is_pending=True, Room=room.id)
#                 # Handle empty slots
#                 if not booking.exists():
#                     print("no data to take action upon")
#                 else:
#                     y = min(booking.values_list('created_at', flat=True))
#                     accept = booking.get(created_at=y)
#                     accept.admin_did_accept=True
#                     accept.is_pending=False
#                     accept.admin_feedback = "Accepted on first come first server basis"
#                     accept.save()
#                     reject = booking.exclude(id=accept.id)
#                     feedback = "Other request was accepted on first come first server basis. This request clashed with it. Therefore it was declined"
#                     reject.update(admin_did_accept=False, is_pending=False, admin_feedback=feedback)
#                     print("Successfully ran the jobs")
#             return Response(["Successfully ran the jobs"])
#         except Exception as e:
#             return Response(["Some error occured",str(e)])
#             print("Some error occured")
