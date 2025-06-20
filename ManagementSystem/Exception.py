from rest_framework.exceptions import APIException
from rest_framework import status
from django.utils.translation import gettext_lazy as _




class Exception(APIException):
   
    def __init__(self, detail=None, code=None,extra=None):
        if detail is not None:
            self.detail = _(detail) 
        else:
            self.detail = self.default_detail
        if code is not None:
            self.default_code = code


class NotFound(Exception):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _('Not found.')
    default_code = 'not_found'
    

class CannotCreateProduct(Exception):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _('Cannot to create product')
    default_code = 'cannot_to_create_product'
