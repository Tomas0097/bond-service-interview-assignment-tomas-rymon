from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient

from web.models import BondModel
from web.rest_framework.serializers import BondSerializer


class UserLoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpassword")

    def test_login_success(self):
        response = self.client.post("/api/users/login/", {"username": "testuser", "password": "testpassword"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)
        self.assertIn("user_id", response.data)

    def test_login_failure(self):
        response = self.client.post("/api/users/login/", {"username": "testuser", "password": "wrongpassword"})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data["login"], ["Invalid credentials"])


class UserDetailsViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.client.force_authenticate(user=self.user)

    def test_get_user_details_success(self):
        response = self.client.get(f"/api/users/{self.user.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], self.user.username)

    def test_get_user_details_not_found(self):
        response = self.client.get("/api/users/999/")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["user"], ["User not found"])


class UserBondsSummaryViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.client.force_authenticate(user=self.user)
        BondModel.objects.create(
            issue_name="Test bond 1",
            isin="CZ0003551251",
            value=1000,
            coupon_type=BondModel.CouponType.FIXED_RATE,
            interest_rate=5.0,
            coupon_frequency_in_months=6,
            purchase_date="2024-01-01",
            maturity_date="2025-01-01",
            owner=self.user,
        )
        BondModel.objects.create(
            issue_name="Test bond 2",
            isin="CZ0003551251",
            value=2000,
            coupon_type=BondModel.CouponType.FIXED_RATE,
            interest_rate=6.0,
            coupon_frequency_in_months=12,
            purchase_date="2024-01-01",
            maturity_date="2025-06-06",
            owner=self.user,
        )

    def test_get_user_bonds_summary(self):
        response = self.client.get(f"/api/users/{self.user.id}/bonds/summary/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["average_interest_rate"], 5.5)
        self.assertEqual(response.data["next_maturing_bond"], "Test bond 1")
        self.assertEqual(response.data["total_portfolio_value"], 3000)


class BondViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.client.force_authenticate(user=self.user)
        self.bond = BondModel.objects.create(
            issue_name="Test bond 1",
            isin="CZ0003551251",
            value=1000,
            coupon_type=BondModel.CouponType.FIXED_RATE,
            interest_rate=5.0,
            coupon_frequency_in_months=6,
            purchase_date="2024-01-01",
            maturity_date="2025-01-01",
            owner=self.user,
        )
        self.bond_without_coupons = BondModel.objects.create(
            issue_name="Test bond 2 with zero coupon",
            isin="CZ0003551251",
            value=1000,
            coupon_type=BondModel.CouponType.ZERO_COUPON,
            interest_rate=0,
            coupon_frequency_in_months=0,
            purchase_date="2024-01-01",
            maturity_date="2025-01-01",
            owner=self.user,
        )

    def test_list_bonds(self):
        response = self.client.get(f"/api/users/{self.user.id}/bonds/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_create_bond(self):
        data = {
            "issue_name": "Test bond 3",
            "isin": "CZ0003551251",
            "value": 1000,
            "coupon_type": BondModel.CouponType.FIXED_RATE.label,
            "interest_rate": 5.0,
            "coupon_frequency_in_months": 6,
            "purchase_date": "2024-01-01",
            "maturity_date": "2025-01-01",
        }
        response = self.client.post(f"/api/users/{self.user.id}/bonds/", data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["owner"], self.user.id)

    def test_update_bond(self):
        updated_data = {
            "issue_name": self.bond.issue_name,
            "isin": self.bond.isin,
            "value": 3000,
            "coupon_type": self.bond.coupon_type.label,
            "interest_rate": self.bond.interest_rate,
            "coupon_frequency_in_months": self.bond.coupon_frequency_in_months,
            "purchase_date": self.bond.purchase_date,
            "maturity_date": self.bond.maturity_date,
        }
        response = self.client.put(f"/api/users/{self.user.id}/bonds/{self.bond.id}/", updated_data, format="json")
        self.assertEqual(response.status_code, 200)
        self.bond.refresh_from_db()
        self.assertEqual(self.bond.value, 3000)


# class BondSerializerTest(TestCase):
#     def setUp(self):
#         self.user = User.objects.create_user(username="testuser", password="testpassword")
#         self.bond = BondModel.objects.create(
#             issue_name="Test bond 1",
#             isin="CZ0003551251",
#             value=1000,
#             coupon_type=BondModel.CouponType.FIXED_RATE,
#             interest_rate=5.0,
#             coupon_frequency_in_months=6,
#             purchase_date="2024-01-01",
#             maturity_date="2025-01-01",
#             owner=self.user,
#         )

#     def test_validate_isin_success(self):
#         BondSerializer().validate_isin("CZ0003551251")
#         self.assertTrue(serializer.is_valid())

#     def test_validate_isin_failure(self):
#         data = {
#             "isin": "invalid_isin",
#             # other required fields
#         }
#         serializer = BondSerializer(data=data)
#         with self.assertRaises(ValidationError):
#             serializer.is_valid(raise_exception=True)

#     def test_validate_dates_failure(self):
#         data = {
#             "purchase_date": "2025-01-01",
#             "maturity_date": "2024-01-01",
#             # other required fields
#         }
#         serializer = BondSerializer(data=data)
#         with self.assertRaises(ValidationError):
#             serializer.is_valid(raise_exception=True)
