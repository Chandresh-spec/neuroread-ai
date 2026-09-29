import pytest
from django.urls import reverse
from rest_framework import status
from accounts.models import User
from accounts.views import get_tokens_for_user


@pytest.mark.django_db
class TestUserModel:
    """Tests for the Custom User model and CustomUserManager."""

    def test_create_user_successful(self):
        user = User.objects.create_user(
            email="norm@example.com",
            password="StrongPassword123!",
            full_name="Norm User",
        )
        assert user.email == "norm@example.com"
        assert user.full_name == "Norm User"
        assert user.check_password("StrongPassword123!")
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False

    def test_create_user_normalizes_email(self):
        user = User.objects.create_user(
            email="UPPER@Example.COM",
            password="StrongPassword123!",
            full_name="Case User",
        )
        assert user.email == "UPPER@example.com"

    def test_create_user_missing_email_raises_value_error(self):
        with pytest.raises(ValueError, match="The Email field must be set."):
            User.objects.create_user(email="", password="password123")

    def test_create_superuser_successful(self):
        admin_user = User.objects.create_superuser(
            email="admin@example.com",
            password="AdminPassword123!",
            full_name="Admin User",
        )
        assert admin_user.is_staff is True
        assert admin_user.is_superuser is True
        assert admin_user.is_active is True

    def test_create_superuser_invalid_staff_flag(self):
        with pytest.raises(ValueError, match="Superuser must have is_staff=True."):
            User.objects.create_superuser(
                email="admin2@example.com",
                password="AdminPassword123!",
                is_staff=False,
            )

    def test_create_superuser_invalid_superuser_flag(self):
        with pytest.raises(ValueError, match="Superuser must have is_superuser=True."):
            User.objects.create_superuser(
                email="admin3@example.com",
                password="AdminPassword123!",
                is_superuser=False,
            )

    def test_user_str_and_get_full_name(self):
        user = User(email="test@domain.com", full_name="John Doe")
        assert str(user) == "test@domain.com"
        assert user.get_full_name() == "John Doe"


@pytest.mark.django_db
class TestRegistrationAPI:
    """Tests for POST /api/auth/register/ endpoint."""

    register_url = reverse("auth-register")

    def test_register_successful(self, api_client):
        payload = {
            "email": "newuser@example.com",
            "full_name": "New User",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!",
        }
        response = api_client.post(self.register_url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["message"] == "Account created successfully."
        assert response.data["user"]["email"] == "newuser@example.com"
        assert "tokens" in response.data
        assert "access" in response.data["tokens"]
        assert "refresh" in response.data["tokens"]

        # Verify persisted in database
        assert User.objects.filter(email="newuser@example.com").exists()

    def test_register_duplicate_email(self, api_client, test_user):
        payload = {
            "email": test_user.email,
            "full_name": "Duplicate User",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!",
        }
        response = api_client.post(self.register_url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_register_password_mismatch(self, api_client):
        payload = {
            "email": "mismatch@example.com",
            "full_name": "Mismatch User",
            "password": "Password123!",
            "confirm_password": "DifferentPassword123!",
        }
        response = api_client.post(self.register_url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "confirm_password" in response.data

    def test_register_password_too_short(self, api_client):
        payload = {
            "email": "short@example.com",
            "full_name": "Short Password",
            "password": "short",
            "confirm_password": "short",
        }
        response = api_client.post(self.register_url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data

    def test_register_missing_fields(self, api_client):
        response = api_client.post(self.register_url, {}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data
        assert "password" in response.data


@pytest.mark.django_db
class TestLoginAPI:
    """Tests for POST /api/auth/login/ endpoint."""

    login_url = reverse("auth-login")

    def test_login_successful(self, api_client, test_user):
        payload = {
            "email": "testuser@example.com",
            "password": "ValidPassword123!",
        }
        response = api_client.post(self.login_url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Login successful."
        assert response.data["user"]["email"] == test_user.email
        assert "tokens" in response.data
        assert "access" in response.data["tokens"]
        assert "refresh" in response.data["tokens"]

    def test_login_wrong_password(self, api_client, test_user):
        payload = {
            "email": test_user.email,
            "password": "WrongPassword!",
        }
        response = api_client.post(self.login_url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_login_nonexistent_email(self, api_client):
        payload = {
            "email": "nonexistent@example.com",
            "password": "ValidPassword123!",
        }
        response = api_client.post(self.login_url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_login_deactivated_user(self, api_client, test_user):
        test_user.is_active = False
        test_user.save()

        payload = {
            "email": test_user.email,
            "password": "ValidPassword123!",
        }
        response = api_client.post(self.login_url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestTokenRefreshAPI:
    """Tests for POST /api/auth/token/refresh/ endpoint."""

    refresh_url = reverse("auth-token-refresh")

    def test_refresh_token_valid(self, api_client, test_user):
        tokens = get_tokens_for_user(test_user)
        response = api_client.post(self.refresh_url, {"refresh": tokens["refresh"]}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data

    def test_refresh_token_invalid(self, api_client):
        response = api_client.post(self.refresh_url, {"refresh": "invalid-token"}, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestProfileAPI:
    """Tests for GET and PATCH /api/auth/profile/ endpoint."""

    profile_url = reverse("auth-profile")

    def test_get_profile_authenticated(self, auth_client, test_user):
        response = auth_client.get(self.profile_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["user"]["email"] == test_user.email
        assert response.data["user"]["full_name"] == test_user.full_name

    def test_get_profile_unauthenticated(self, api_client):
        response = api_client.get(self.profile_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_profile_patch(self, auth_client, test_user):
        payload = {
            "full_name": "Updated Full Name",
            "bio": "Avid reader and learner.",
        }
        response = auth_client.patch(self.profile_url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["user"]["full_name"] == "Updated Full Name"
        assert response.data["user"]["bio"] == "Avid reader and learner."

        test_user.refresh_from_db()
        assert test_user.full_name == "Updated Full Name"
        assert test_user.bio == "Avid reader and learner."


@pytest.mark.django_db
class TestLogoutAPI:
    """Tests for POST /api/auth/logout/ endpoint."""

    logout_url = reverse("auth-logout")

    def test_logout_successful(self, auth_client, test_user):
        tokens = get_tokens_for_user(test_user)
        response = auth_client.post(self.logout_url, {"refresh": tokens["refresh"]}, format="json")
        assert response.status_code == status.HTTP_205_RESET_CONTENT
        assert response.data["message"] == "Logged out successfully."

        # Verify refresh token can no longer be used to obtain new access tokens
        refresh_url = reverse("auth-token-refresh")
        refresh_response = auth_client.post(refresh_url, {"refresh": tokens["refresh"]}, format="json")
        assert refresh_response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout_missing_refresh_token(self, auth_client):
        response = auth_client.post(self.logout_url, {}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Refresh token is required" in response.data["error"]

    def test_logout_unauthenticated(self, api_client, test_user):
        tokens = get_tokens_for_user(test_user)
        response = api_client.post(self.logout_url, {"refresh": tokens["refresh"]}, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
