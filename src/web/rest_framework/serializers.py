from django.contrib.auth.models import User
from rest_framework import serializers

from web.models import BondModel
from web.rest_framework.fields import CouponTypeField


class UserSerializer(serializers.ModelSerializer):
    bonds = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=BondModel.objects.all()
    )

    class Meta:
        model = User
        fields = ["id", "username", "bonds"]


class BondSerializer(serializers.ModelSerializer):
    coupon_type = CouponTypeField(BondModel.CouponType.choices)

    def get_coupon_type(self, obj):
        return obj.get_coupon_type_display()

    class Meta:
        model = BondModel
        fields = [
            "id",
            "issue_name",
            "isin",
            "value",
            "coupon_type",
            "interest_rate",
            "coupon_frequency_in_months",
            "purchase_date",
            "maturity_date",
            "owner"
        ]
