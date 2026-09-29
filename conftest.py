import pytest
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from accounts.models import User
from accounts.views import get_tokens_for_user


@pytest.fixture
def api_client():
    """Unauthenticated DRF APIClient."""
    return APIClient()


@pytest.fixture
def test_user(db):
    """Primary verified test user."""
    return User.objects.create_user(
        email="testuser@example.com",
        password="ValidPassword123!",
        full_name="Test User",
    )


@pytest.fixture
def test_user_tokens(test_user):
    """JWT tokens for the primary test user."""
    return get_tokens_for_user(test_user)


@pytest.fixture
def auth_client(api_client, test_user):
    """DRF APIClient authenticated as primary test user."""
    api_client.force_authenticate(user=test_user)
    return api_client


@pytest.fixture
def second_user(db):
    """Secondary user to test isolation and permissions."""
    return User.objects.create_user(
        email="otheruser@example.com",
        password="ValidPassword123!",
        full_name="Other User",
    )


@pytest.fixture
def second_auth_client(second_user):
    """DRF APIClient authenticated as second user."""
    client = APIClient()
    client.force_authenticate(user=second_user)
    return client


@pytest.fixture
def sample_pdf():
    """A dummy PDF file upload object."""
    return SimpleUploadedFile(
        "test_document.pdf",
        b"%PDF-1.4 dummy binary content for testing",
        content_type="application/pdf",
    )


@pytest.fixture
def sample_txt():
    """A dummy TXT file upload object."""
    return SimpleUploadedFile(
        "test_notes.txt",
        b"This is a sample text file content for reading test.",
        content_type="text/plain",
    )
