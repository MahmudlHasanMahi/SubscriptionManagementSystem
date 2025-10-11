from jinja2 import Template
from datetime import date
import pdfkit
import os

def generate_invoice(objs):
    base_dir = os.path.dirname(os.path.abspath(__file__))  
    template_path = os.path.join(base_dir, "invoice", "invoice.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = Template(f.read())
    
    today = date.today()
    formatted = today.strftime("%B %-d, %Y")
    

    client = {
                "email": objs.get("client_detail").get("email"),
                "name":objs.get("client_detail").get("name")


            }
    subscription = {
        "created":formatted

    }
    extracted = []
    total = 0
    for plan in objs.get("subscription_plans"):
        if plan.get("status") == "ACTIVE":
            period = plan.get("price").get("title").split("/")[-1]
            price = plan.get("price").get("price")
            quantity = plan.get("quantity")
            extracted.append({
            "product_name": plan.get("product").get("name"),
            "unit_price":plan.get("price").get("title"),
            "quantity": quantity,
            "price": f'{price * quantity}/{period}',
            })
            total +=  price * quantity
    total = f'{total}/{period}'

        
    html_filled = template.render(client=client,subscription=subscription,extracted=extracted,total=total)
    output_path = os.path.join(base_dir, "invoice", "invoice.pdf")
    pdf = pdfkit.from_string(html_filled, False)
    return pdf
