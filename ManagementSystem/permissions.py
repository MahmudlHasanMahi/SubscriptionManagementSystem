from rest_framework.permissions import BasePermission,SAFE_METHODS


class SubscriptionPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        method = request.method
        if user.has_perm("ManagementSystem.can_approve_subscription"):
            return True
        return False