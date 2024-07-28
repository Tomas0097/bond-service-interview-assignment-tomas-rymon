from django.contrib import admin

from web.models import BondModel


@admin.register(BondModel)
class BondAdmin(admin.ModelAdmin):
    list_display = (
        "issue_name",
        "value",
        "purchase_date",
        "maturity_date",
        "owner",
    )
