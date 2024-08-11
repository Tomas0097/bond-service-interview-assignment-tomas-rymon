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

    def validate(self, data):
        coupon_type = data.get('coupon_type')
        interest_rate = data.get('interest_rate')
        coupon_frequency_in_months = data.get('coupon_frequency_in_months')
        purchase_date = data.get('purchase_date')
        maturity_date = data.get('maturity_date')

        if coupon_type == BondModel.CouponType.ZERO_COUPON:
            if interest_rate:
                raise serializers.ValidationError({
                    'interest_rate': 'Interest rate must be zero for zero coupon bond.'
                })
            if coupon_frequency_in_months:
                raise serializers.ValidationError({
                    'coupon_frequency_in_months': 'Coupon frequency in months must be zero for zero coupon bond.'
                })
        else:
            if not interest_rate:
                raise serializers.ValidationError({
                    'interest_rate': 'Interest rate is required for bond with coupons.'
                })
            if not coupon_frequency_in_months:
                raise serializers.ValidationError({
                    'coupon_frequency_in_months': 'Coupon frequency in months is required for bond with coupons.'
                })

        if maturity_date <= purchase_date:
            raise serializers.ValidationError("Purchase date must be earlier than Maturity date.")

        return data

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
