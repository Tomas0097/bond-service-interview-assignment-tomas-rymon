from django.urls import path, include
from rest_framework import routers

from web.rest_framework.view_sets import UserViewSet

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)

app_name = "web"

urlpatterns = [
    path("", include(router.urls)),
]
