import pytest
from django.urls import reverse
from rest_framework import status
from user_preferences.models import UserProfile


@pytest.mark.django_db
class TestUserPreferences:
    """Tests for /api/preferences/ and /api/preferences/settings/."""

    prefs_url = reverse("manage_preferences")
    settings_url = reverse("smart_settings")

    def test_preferences_unauthenticated(self, api_client):
        response = api_client.get(self.prefs_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_preferences_default(self, auth_client, test_user):
        response = auth_client.get(self.prefs_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["reading_need"] == "general"
        assert response.data["reading_need_display"] == "General / Optimized Reading"

    def test_patch_preferences_valid_choice(self, auth_client, test_user):
        response = auth_client.patch(self.prefs_url, {"reading_need": "dyslexia"}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["reading_need"] == "dyslexia"

        test_user.refresh_from_db()
        assert test_user.profile.reading_need == "dyslexia"

    def test_patch_preferences_invalid_choice(self, auth_client):
        response = auth_client.patch(self.prefs_url, {"reading_need": "invalid_choice"}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Invalid reading need choice" in response.data["error"]

    def test_patch_preferences_missing_field(self, auth_client):
        response = auth_client.patch(self.prefs_url, {}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "reading_need field is required" in response.data["error"]

    def test_smart_settings_for_dyslexia(self, auth_client, test_user):
        # Update user profile to dyslexia
        auth_client.patch(self.prefs_url, {"reading_need": "dyslexia"}, format="json")

        response = auth_client.get(self.settings_url)
        assert response.status_code == status.HTTP_200_OK
        assert "--font-reading" in response.data["settings"]
        assert "Atkinson Hyperlegible" in response.data["settings"]["--font-reading"]
        assert response.data["applied_profile"] == "dyslexia"

    def test_user_profile_str_representation(self, test_user):
        profile = UserProfile.objects.create(user=test_user, reading_need="adhd")
        assert str(profile) == f"{test_user.email} - ADHD / Focus Issues"
