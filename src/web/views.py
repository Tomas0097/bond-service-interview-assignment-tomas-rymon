from django.views.generic import TemplateView

class HomepageView(TemplateView):
    template_name = "homepage.html"

class UserPageView(TemplateView):
    template_name = "user-page.html"
