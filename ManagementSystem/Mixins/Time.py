from django.utils import timezone
from datetime import timedelta
class Time:
    @property
    def time_now(self):
        return timezone.now() + timedelta(days=0)
        # return timezone.now()
