from rest_framework import serializers
from web.models import BondModel


class CouponTypeField(serializers.ChoiceField):
    def to_representation(self, value):
        return BondModel.CouponType(value).label

    def to_internal_value(self, value):
        for key, label in BondModel.CouponType.choices:
            if label == value:
                return key

        self.fail("invalid_choice", input=value)
