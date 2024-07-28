from rest_framework import viewsets

from web.models import BondModel
from web.rest_framework.permissions import IsOwner
from web.rest_framework.serializers import BondSerializer


class BondViewSet(viewsets.ModelViewSet):
    queryset = BondModel.objects.all()
    serializer_class = BondSerializer
    permission_classes = [IsOwner]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
