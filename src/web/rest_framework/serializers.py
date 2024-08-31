import requests
from django.contrib.auth.models import User
from rest_framework import serializers

from web.models import BondModel
from web.rest_framework.fields import CouponTypeField


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class BondSerializer(serializers.ModelSerializer):
    coupon_type = CouponTypeField(BondModel.CouponType.choices)

    def validate_isin(self, value):
        # Validate the ISIN by calling central securities depository API
        response = requests.get(f"https://www.cdcp.cz/isbpublicjson/api/VydaneISINy?isin={value}")

        if response.status_code == 200:
            return value
        elif response.status_code == 400:
            raise serializers.ValidationError("The ISIN is not valid by the central securities depository.")
        raise serializers.ValidationError("Validation of the ISIN has failed.")

    def validate(self, data):
        purchase_date = data.get("purchase_date")
        maturity_date = data.get("maturity_date")
        coupon_type = data.get("coupon_type")
        interest_rate = data.get("interest_rate")
        coupon_frequency_in_months = data.get("coupon_frequency_in_months")

        self._validate_dates(purchase_date, maturity_date)
        self._validate_coupons(coupon_type, interest_rate, coupon_frequency_in_months)

        return data

    @staticmethod
    def _validate_dates(purchase_date, maturity_date):
        if maturity_date <= purchase_date:
            raise serializers.ValidationError("Purchase date must be earlier than Maturity date.")

    @staticmethod
    def _validate_coupons(coupon_type, interest_rate, coupon_frequency_in_months):
        if coupon_type == BondModel.CouponType.ZERO_COUPON:
            if interest_rate:
                raise serializers.ValidationError({
                    "interest_rate": "Interest rate must be zero for zero coupon bond."
                })
            if coupon_frequency_in_months:
                raise serializers.ValidationError({
                    "coupon_frequency_in_months": "Coupon frequency in months must be zero for zero coupon bond."
                })
        else:
            if not interest_rate:
                raise serializers.ValidationError({
                    "interest_rate": "Interest rate is required for bond with coupons."
                })
            if not coupon_frequency_in_months:
                raise serializers.ValidationError({
                    "coupon_frequency_in_months": "Coupon frequency in months is required for bond with coupons."
                })

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
