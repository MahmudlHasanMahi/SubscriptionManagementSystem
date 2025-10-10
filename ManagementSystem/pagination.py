from rest_framework.pagination import PageNumberPagination,CursorPagination
from rest_framework.response import Response
from urllib.parse import urlparse, parse_qs,urlencode

class Pagination(CursorPagination):
    page_size = 5
    ordering='pk'
    cursor_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'next': self._extract_query(self.get_next_link()),
            'previous': self._extract_query(self.get_previous_link()),
            'results': data,
        })

    def _extract_query(self, url):
        if not url:
            return None
        parsed = urlparse(url)
        query = parse_qs(parsed.query)
        clean_query = {
            'page': query.get('page', [''])[0],
        }

        return urlencode(clean_query)

    @classmethod
    def set_page_size(cls,size):
        try:
            if isinstance(int(size), int):
                cls.page_size = int(size)
        except:
            return None