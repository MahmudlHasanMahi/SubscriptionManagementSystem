import os, django
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "SubscriptionManagement.settings")
django.setup()
from User.models import User
from ManagementSystem.models import SubscriptionPlan
from User.CustomGroup import Groups
from faker import Faker
import pdfkit
from jinja2 import Template
import random
#    groups = validated_data.get("groups_level")
#     name = validated_data.get("name")
#     email = validated_data.get("email")
#     password = validated_data.get("password")
#     mobile = validated_data.get("mobile")
#     is_active = validated_data.get("active")
#     group = Groups.objects.get(name=group


def generate_user(n):
    USER = n
    faker = Faker()
    group = list(Groups.objects.all())

    for _ in range(USER):
        obj = User.objects.create(
                name=faker.name(),
                email=faker.email(),
                password=faker.password(),
                mobile=faker.msisdn()[:10],
                is_active=True,
        )
        obj.groups.add(random.choice(group))
        obj.save()
    print(f"{USER} user Added!!")

def generate_invoice(objs):

    for obj in objs:
        print(obj)
    with open("invoice/invoice.html", "r", encoding="utf-8") as f:
        template = Template(f.read())

    items = []
    total = 0
    for obj in objs:
        name,quantity,price = obj.product.name,obj.quantity,obj.price.price
        items.append({
            "name":name,
            "quantity":quantity,
            "price":price
            })
        total += price
        

    html_filled = template.render(items=items,total=total)
    pdfkit.from_string(html_filled, "invoice/invoice.pdf")
    print("PDF generated successfully!")
    
    return

def main():
    x = int(input())
    generate_user(x)
    



if __name__ == "__main__":
    main()