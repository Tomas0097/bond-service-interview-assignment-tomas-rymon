from django.contrib.auth.models import User
from django.db import models
from django.db.models.fields import (
    CharField,
    DateField,
    DecimalField,
    IntegerField
)


class BondModel(models.Model):
    class CouponType(models.TextChoices):
        FIXED_RATE = "FIXED_RATE", "Fixed Rate"
        FLOATING_RATE = "FLOATING_RATE", "Floating Rate"
        ZERO_COUPON = "ZERO_COUPON", "Zero Coupon"
        STEP_UP = "STEP_UP", "Step Up"

    issue_name = CharField(
        verbose_name="Issue Name",
        max_length=255
    )
    isin = CharField(
        verbose_name="ISIN",
        max_length=255
    )
    value = IntegerField(
        verbose_name="Value"
    )
    coupon_type = CharField(
        verbose_name="Coupon Type",
        choices=CouponType.choices,
        max_length=255
    )
    interest_rate = DecimalField(
        verbose_name="Interest Rate",
        blank=True,
        null=True,
        max_digits=4,
        decimal_places=2,
    )
    coupon_frequency_in_months = IntegerField(
        verbose_name="Coupon Frequency in Months"
    )
    purchase_date = DateField(
        verbose_name="Purchase Date"
    )
    maturity_date = DateField(
        verbose_name="Maturity Date"
    )
    owner = models.ForeignKey(
        User,
        verbose_name="Owner",
        on_delete=models.RESTRICT,
        related_name="bonds"
    )

    class Meta:
        verbose_name = "Bond"
        verbose_name_plural = "Bonds"
