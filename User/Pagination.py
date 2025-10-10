from ManagementSystem.pagination import Pagination
class StaffPagination(Pagination):
    page_size = 5
    ordering='pk'
    cursor_query_param = 'page'
    
    @classmethod
    def set_page_size(cls,size):
        try:
            if isinstance(int(size), int):
                cls.page_size = int(size)
        except:
            return None
            