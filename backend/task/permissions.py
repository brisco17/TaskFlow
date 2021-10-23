from rest_framework import permissions


class IsAuthor(permissions.IsAuthenticated):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):

        # Checks to see if the user is 1) Authenticated, and 2) the Author of the requested object
        return self.has_permission(request, view) and obj.user == request.user