from django.urls import include, path

from . import views

app_name = "web"

urlpatterns = [
    path("", views.HomepageView.as_view(), name="homepage"),
    path("user-profile/", views.UserProfileView.as_view(), name="user_profile"),
    path("api/", include("web.rest_framework.urls")),
]

