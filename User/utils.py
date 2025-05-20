import os
import django
import sys

# Setup Django
sys.path.append("/Volumes/MAHMUD_SSD/Codes/SubscriptionManagement/SubscriptionManagement")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "SubscriptionManagement.settings")
django.setup()

from User.CustomGroup import Groups
from User.models import User






def main():
    print(staffQuery(User.objects.get(pk=2)))




if __name__ == "__main__":
    main()


