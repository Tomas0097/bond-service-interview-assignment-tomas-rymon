from django.contrib.auth.models import User
from rest_framework import permissions, viewsets

from web.rest_framework.serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]