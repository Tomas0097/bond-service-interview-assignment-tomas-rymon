from django.urls import path, include
from rest_framework import routers

from web.rest_framework import views
from web.rest_framework import view_sets


router = routers.DefaultRouter()
router.register(r"user-bonds", view_sets.BondViewSet)

app_name = "web"

urlpatterns = [
    path("", include(router.urls)),
    path("user-login/", views.UserLoginView.as_view(), name="user-login"),
    path("user-details/", views.UserDetailsView.as_view(), name="user-details"),
]
