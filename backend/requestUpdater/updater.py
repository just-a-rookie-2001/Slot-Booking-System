import datetime
from datetime import datetime, timedelta, date

from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job
from BookingSystem.models import Booking, Room

scheduler = BackgroundScheduler()
scheduler.add_jobstore(DjangoJobStore(), "default")


# @register_job(scheduler, "cron", hour='23', minute="55", replace_existing=True)
# def update_requests():
#     try:
#         for room in Room.objects.all():
#             date = datetime.date.today() + datetime.timedelta(days=1)
#             booking = Booking.objects.filter(
#                 booking_date=date, is_pending=True, Room=room.id)
#             # Handle empty slots
#             if not booking.exists():
#                 print("no data to take action upon")
#             else:
#                 slotList = booking.order_by('start_timing').distinct(
#                     'start_timing').values_list('start_timing', flat=True)
#                 for slot in slotList:
#                     slots = booking.filter(start_timing__exact=slot)
#                     if not slots.exists():
#                         print("This slot doesn't have any pending requests")
#                     else:
#                         y = min(slots.values_list('created_at', flat=True))
#                         accept = slots.get(created_at=y)
#                         accept.admin_did_accept = True
#                         accept.is_pending = False
#                         accept.admin_feedback = "Accepted on first come first server basis"
#                         accept.save()
#                         reject = slots.exclude(id=accept.id)
#                         feedback = "Declined on first come first serve basis"
#                         reject.update(admin_did_accept=False,
#                                       is_pending=False, admin_feedback=feedback)
#                         print("Successfully ran the jobs")
#     except Exception as e:
#         print("Some error occured", str(e))


# Every half an hour accept the pending requests of all slots of that date on first come first serve basis
@register_job(scheduler, "cron", minute="0,30", replace_existing=True)
def update_req():
    try:
        x = datetime.now()
        rounded = (x - (x - datetime.min) % timedelta(minutes=30)).strftime("%H:%M")
        for room in Room.objects.all():
            booking = Booking.objects.filter(is_pending=True, booking_date=date.today(), Room=room)
            # Handle empty slots
            if not booking.exists():
                print("no data to take action upon")
            else:
                slots = booking.filter(start_timing=rounded)
                if not slots.exists():
                    print("This slot doesn't have any pending requests")
                else:
                    y = min(slots.values_list('created_at', flat=True))
                    accept = slots.get(created_at=y)
                    accept.admin_did_accept = True
                    accept.is_pending = False
                    accept.admin_feedback = "Accepted on first come first server basis"
                    accept.save()
                    reject = slots.exclude(id=accept.id)
                    feedback = "Declined on first come first serve basis"
                    reject.update(admin_did_accept=False,
                                  is_pending=False, admin_feedback=feedback)
                    print("Successfully ran the jobs")
    except Exception as e:
        print("Some error occured: "+str(e))


register_events(scheduler)


def start():
    scheduler.start()
    print("Scheduler started!")
