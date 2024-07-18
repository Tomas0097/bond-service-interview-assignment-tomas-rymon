from django.urls import include, path

from . import views

app_name = "web"

urlpatterns = [
    path("", views.HomepageView.as_view(), name="homepage"),
    path("api/", include("web.rest_framework.urls")),
]

