# from datetime import datetime
# import time
# import random
# from pytz import utc

# from apscheduler.schedulers.background import BackgroundScheduler
# from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job
# from apscheduler.executors.pool import ProcessPoolExecutor
# from apscheduler.schedulers.background import BackgroundScheduler

# from requestUpdater import updateRequests


# def start():
#     executors = {
#         'default': {'type': 'threadpool', 'max_workers': 20},
#         'processpool': ProcessPoolExecutor(max_workers=5)
#     }
#     job_defaults = {
#         'coalesce': False,
#         'max_instances': 3
#     }
#     scheduler = BackgroundScheduler()
#     scheduler.add_jobstore(DjangoJobStore(), 'default')

#     # .. do something else here, maybe add jobs etc.

#     @register_job(scheduler, "interval", seconds=5, replace_existing=True)
#     def test_job():
#         time.sleep(random.randrange(1, 100, 1)/100.)
#         print("I'm a test job!")
#     # scheduler.add_job(updateRequests.update_requests, 'interval', hours=1)

#     register_events(scheduler)
#     # scheduler.configure(jobstores=jobstores, executors=executors, job_defaults=job_defaults, timezone=utc)

#     scheduler.start()

import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job
from BookingSystem.models import Booking, Room

scheduler = BackgroundScheduler()
scheduler.add_jobstore(DjangoJobStore(), "default")


@register_job(scheduler, "cron", hour='23', minute="55", replace_existing=True)
def update_requests():
    try:
        for room in Room.objects.all():
            date = datetime.date.today() + datetime.timedelta(days=1)
            booking = Booking.objects.filter(booking_date=date, is_pending=True, Room=room.id)
            # Handle empty slots
            if not booking.exists():
                print("no data to take action upon")
            else:
                slotList = booking.order_by('start_timing').distinct('start_timing').values_list('start_timing', flat=True)
                for slot in slotList:
                    slots = booking.filter(start_timing__exact=slot)
                    if not slots.exists():
                        print("This slot doesn't have any pending requests")
                    else:
                        y = min(slots.values_list('created_at', flat=True))
                        accept = slots.get(created_at=y)
                        accept.admin_did_accept=True
                        accept.is_pending=False
                        accept.admin_feedback = "Accepted on first come first server basis"
                        accept.save()
                        reject = slots.exclude(id=accept.id)
                        feedback = "Other request was accepted on first come first server basis. This request clashed with it. Therefore it was declined"
                        reject.update(admin_did_accept=False, is_pending=False, admin_feedback=feedback)
                        print("Successfully ran the jobs")
    except Exception as e:
        print("Some error occured",str(e))

register_events(scheduler)


def start():
    scheduler.start()
    print("Scheduler started!")
