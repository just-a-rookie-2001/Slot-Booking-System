from django.apps import AppConfig


class BookingsystemConfig(AppConfig):
    name = 'BookingSystem'

    def ready(self):
        from requestUpdater import updater
        updater.start()
