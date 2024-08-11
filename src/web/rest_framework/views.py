from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework.authtoken.models import Token
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from web.rest_framework.serializers import UserSerializer


class UserLoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(
            username=request.data["username"],
            password=request.data["password"]
        )

        if user:
            token, created = Token.objects.get_or_create(user=user)

            return Response({"token": token.key, "user_id": user.id})
        return Response({"login": ["Invalid credentials"]}, status=401)


class UserDetailsView(RetrieveAPIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"user": ["User not found"]}, status=404)

        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserBondsSummaryView(RetrieveAPIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"user": ["User not found"]}, status=404)

        user_bonds = user.bonds.all()
        interest_rates = user_bonds.values_list("interest_rate", flat=True)
        average_interest_rate = (sum(interest_rates) / len(interest_rates)) if interest_rates else 0
        next_maturing_bond = getattr(user_bonds.order_by("maturity_date").first(), "issue_name", "None")
        total_portfolio_value = sum(user_bonds.values_list("value", flat=True))

        return Response({
            "average_interest_rate": average_interest_rate,
            "next_maturing_bond": next_maturing_bond,
            "total_portfolio_value": total_portfolio_value,
        })
