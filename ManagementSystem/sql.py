from django.db import connection,transaction
from .models import *
from datetime import date
def get_product_sql(id):
    sql = """

    SELECT * FROM ManagementSystem_product WHERE id = %s

    """
    product =  Product.objects.raw(sql,[id])
    return next(iter(product))

def get_products_sql(**kwargs):
    filter =kwargs.get("filter") 
    if filter:
        data = kwargs.get("data")
        sql = f""" SELECT * FROM ManagementSystem_product 
                    WHERE name LIKE '%{data}%' 
            """
        
    else:
        sql = """
            SELECT * FROM ManagementSystem_product 
        """

    return Product.objects.raw(sql)
    
def get_price_list(**kwargs):
    filter = kwargs.get("filter") 
    if filter:
        sql = f"""
            SELECT pricelist.*, period.* FROM ManagementSystem_pricelist pricelist JOIN
            ManagementSystem_period period ON pricelist.period_id = period.id
            WHERE (pricelist.price || '/' || period.name) LIKE '%{filter}%' 
            """
    else:
        sql = """
            SELECT pricelist.*, period.* FROM ManagementSystem_pricelist pricelist JOIN
            ManagementSystem_period period ON pricelist.period_id = period.id

            """
    return PriceList.objects.raw(sql)

def create_product_sql(name, description, default_price_id, price_list_ids):
    try:
        with transaction.atomic():
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO ManagementSystem_product (
                            name, description, default_price_id,created_at
                            )
                    VALUES (%s, %s, %s,%s)
                """, [name, description, default_price_id,date.today()])

                product_id = cursor.lastrowid
                
                for pid in price_list_ids:
                    cursor.execute("""
                        INSERT INTO ManagementSystem_product_price_list (product_id, pricelist_id)
                        VALUES (%s, %s)
                    """, [product_id, pid])

            return True
    except Exception as e:
        return False


def update_product_sql(product_id, name=None, description=None, default_price_id=None, price_list_ids=None):
    with transaction.atomic():
        with connection.cursor() as cursor:
            updates = []
            params = []

            if name is not None:
                updates.append("name = %s")
                params.append(name)
            if description is not None:
                updates.append("description = %s")
                params.append(description)
            if default_price_id is not None:
                updates.append("default_price_id = %s")
                params.append(default_price_id)
            if updates:
                sql = f"UPDATE ManagementSystem_product SET {', '.join(updates)} WHERE id = %s"
                params.append(product_id)
                cursor.execute(sql, params)

            if price_list_ids is not None:
                cursor.execute(
                    "DELETE FROM ManagementSystem_product_price_list WHERE product_id = %s",
                    [product_id]
                )
                for pid in price_list_ids:
                    cursor.execute(
                        "INSERT INTO ManagementSystem_product_price_list (product_id, pricelist_id) VALUES (%s, %s)",
                        [product_id, pid]
                    )

def get_subscription(id):
    try:
        return next(iter(Subscription.objects.raw(
            "SELECT * FROM ManagementSystem_subscription WHERE id = %s", [id]
        )))
    except StopIteration:
        raise Subscription.DoesNotExist(f"Subscription with id {id} does not exist.")

def create_subscription_sql(status,approved=False,**kwargs):
    begin = kwargs.get("begin",None)
    end = kwargs.get("end",None)
    created_by = kwargs.get("created_by",None)
    client = kwargs.get("client",None)
    rejected_by = kwargs.get("rejected_by",None)
    approved = 1 if approved else 0

    with connection.cursor() as cursor:
        sql = """
        INSERT INTO ManagementSystem_subscription
        (begin, end, status, approved, client_id, created_by_id, rejected_by_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, [
            begin,   # begin
            end, # end
            status,   # status
            approved,          # approved
            client.id,         # client_id
            created_by.id,          # created_by_id
            None,
        ])
        # new_id = cursor.fetchone()[0]
        return get_subscription(cursor.lastrowid)

        
def update_subscription(instance, validated_data):
    table = "ManagementSystem_subscription"
    pk_field = "id"
    pk_value = instance.id

    updates = []
    params = []

    # Build dynamic SET clause
    for field, value in validated_data.items():
        if field in [
            "begin",
            "end",
            "status",
            "approved",
            "client_id",
            "created_by_id",
            "rejected_by_id",
        ]:
            updates.append(f"{field} = %s")
            params.append(value)

    # nothing to update
    if not updates:
        return instance

    sql = f"""
        UPDATE {table}
        SET {', '.join(updates)}
        WHERE {pk_field} = %s
    """
    params.append(pk_value)

    with connection.cursor() as cursor:
        cursor.execute(sql, params)

    # refresh object from DB so latest values are available
    instance.refresh_from_db()

    return instance




def create_pricelist(price,period_id):
    with connection.cursor() as cursor:
        sql = """
            INSERT INTO ManagementSystem_pricelist (price, period_id)
            VALUES (%s, %s)
            RETURNING id
        """
        cursor.execute(sql, [price, period_id])
        new_id = cursor.fetchone()[0]  # fetch the inserted ID
        return {"success": True, "id": new_id}

def get_subscription_plan(id):
    return next(iter(SubscriptionPlan.objects.raw("SELECT * FROM ManagementSystem_subscriptionplan WHERE id = %s ",[id])))

def update_subscription_plan( instance, validated_data):
        table = "ManagementSystem_subscriptionplan"
        pk_field = "id"
        pk_value = instance.id

        updates = []
        params = []

        for field, value in validated_data.items():
            if field == "price" and value is not None:
                updates.append("price_id = %s")
                params.append(value.id)
            elif field == "product" and value is not None:
                updates.append("product_id = %s")
                params.append(value.id)
            elif field in ["status", "quantity"]:
                updates.append(f"{field} = %s")
                params.append(value)

        if not updates:
            return instance  # nothing to update

        sql = f"""
            UPDATE {table}
            SET {', '.join(updates)}
            WHERE {pk_field} = %s
        """
        params.append(pk_value)

        with connection.cursor() as cursor:
            cursor.execute(sql, params)

        # reload fresh values from DB
        instance.refresh_from_db()

        return instance



def bulk_insert_subscription_plans(validated_data):
    values = []
    for item in validated_data:
        print(item.__dict__)
        subscription_id = item.subscription_id  
        status = item.status   
        quantity = item.quantity
        price_id = item.price_id
        product_id = item.product_id
        
        values.append((status, quantity, price_id, product_id, subscription_id))
    
    with connection.cursor() as cursor:
        sql = """
        INSERT INTO ManagementSystem_subscriptionplan
        (status, quantity, price_id, product_id, subscription_id)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.executemany(sql, values)