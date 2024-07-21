from django.views.generic import TemplateView

class HomepageView(TemplateView):
    template_name = "homepage.html"

class UserProfileView(TemplateView):
    template_name = "user-profile.html"
