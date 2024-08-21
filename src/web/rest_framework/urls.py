from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import routers

from web.rest_framework import views
from web.rest_framework import view_sets


bonds_router = routers.DefaultRouter()
bonds_router.register(r"bonds", view_sets.BondViewSet)

urlpatterns = [
    path("users/login/", views.UserLoginView.as_view(), name="user-login"),
    path("users/<int:user_id>/", views.UserDetailsView.as_view(), name="user-details"),
    path("users/<int:user_id>/bonds/summary/", views.UserBondsSummaryView.as_view(), name="user-bonds-summary"),
    path("users/<int:user_id>/", include(bonds_router.urls), name="user-bonds"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("schema/swagger-ui/", SpectacularSwaggerView.as_view(url_name="web:schema"), name="swagger-ui"),
]
