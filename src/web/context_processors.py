from django.conf import settings


def common_data(request):
    context_data = {"CURRENT_FRONTEND_VERSION": settings.CURRENT_FRONTEND_VERSION}

    return context_data
