import os
import shutil
import tempfile
import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from library.models import UserFile, UserReadingData

TEMP_MEDIA_DIR = tempfile.mkdtemp()


@pytest.fixture(autouse=True)
def media_storage(settings):
    """Isolate media files to a temporary directory during tests."""
    with tempfile.TemporaryDirectory() as temp_dir:
        settings.MEDIA_ROOT = temp_dir
        yield temp_dir


@pytest.mark.django_db
class TestUserFileListCreate:
    """Tests for GET & POST /api/library/files/."""

    files_url = reverse("library-files")

    def test_list_files_unauthenticated(self, api_client):
        response = api_client.get(self.files_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_files_empty(self, auth_client):
        response = auth_client.get(self.files_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    def test_upload_pdf_success(self, auth_client, sample_pdf):
        payload = {"file": sample_pdf}
        response = auth_client.post(self.files_url, payload, format="multipart")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "Test Document"
        assert response.data["file_type"] == "PDF"
        assert response.data["size"] > 0
        assert "file_url" in response.data

    def test_upload_txt_custom_title(self, auth_client, sample_txt):
        payload = {"file": sample_txt, "title": "My Custom Title"}
        response = auth_client.post(self.files_url, payload, format="multipart")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "My Custom Title"
        assert response.data["file_type"] == "TXT"

    def test_upload_unsupported_file_extension(self, auth_client):
        bad_file = SimpleUploadedFile("script.py", b"print('bad')", content_type="text/x-python")
        response = auth_client.post(self.files_url, {"file": bad_file}, format="multipart")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Unsupported file type" in str(response.data)

    def test_upload_missing_file(self, auth_client):
        response = auth_client.post(self.files_url, {"title": "No File"}, format="multipart")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "file" in response.data

    def test_list_files_user_isolation(self, auth_client, second_auth_client, sample_pdf, sample_txt):
        # User 1 uploads a file
        auth_client.post(self.files_url, {"file": sample_pdf}, format="multipart")
        # User 2 uploads a file
        second_auth_client.post(self.files_url, {"file": sample_txt}, format="multipart")

        # User 1 should only see 1 file (PDF)
        res1 = auth_client.get(self.files_url)
        assert res1.status_code == status.HTTP_200_OK
        assert len(res1.data) == 1
        assert res1.data[0]["file_type"] == "PDF"

        # User 2 should only see 1 file (TXT)
        res2 = second_auth_client.get(self.files_url)
        assert res2.status_code == status.HTTP_200_OK
        assert len(res2.data) == 1
        assert res2.data[0]["file_type"] == "TXT"


@pytest.mark.django_db
class TestUserFileDetail:
    """Tests for DELETE /api/library/files/<pk>/."""

    def test_delete_file_success(self, auth_client, sample_pdf):
        # First upload a file
        up_res = auth_client.post(reverse("library-files"), {"file": sample_pdf}, format="multipart")
        file_id = up_res.data["id"]

        del_url = reverse("library-file-detail", kwargs={"pk": file_id})
        response = auth_client.delete(del_url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not UserFile.objects.filter(id=file_id).exists()

    def test_delete_other_user_file_forbidden(self, auth_client, second_auth_client, sample_pdf):
        up_res = auth_client.post(reverse("library-files"), {"file": sample_pdf}, format="multipart")
        file_id = up_res.data["id"]

        del_url = reverse("library-file-detail", kwargs={"pk": file_id})
        # Second user tries to delete User 1's file
        response = second_auth_client.delete(del_url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert UserFile.objects.filter(id=file_id).exists()

    def test_delete_unauthenticated(self, api_client, test_user, sample_pdf):
        user_file = UserFile.objects.create(
            user=test_user,
            title="Doc",
            file=sample_pdf,
            file_type="PDF",
            size=100,
        )
        del_url = reverse("library-file-detail", kwargs={"pk": user_file.id})
        response = api_client.delete(del_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUserFileServe:
    """Tests for GET /api/library/files/<pk>/serve/."""

    def test_serve_file_success(self, auth_client, sample_pdf):
        up_res = auth_client.post(reverse("library-files"), {"file": sample_pdf}, format="multipart")
        file_id = up_res.data["id"]

        serve_url = reverse("library-file-serve", kwargs={"pk": file_id})
        response = auth_client.get(serve_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.headers.get("Content-Type") == "application/pdf"
        assert "inline;" in response.headers.get("Content-Disposition", "")
        # Check bytes
        content = b"".join(response.streaming_content)
        assert b"%PDF-1.4" in content

    def test_serve_other_user_file_not_found(self, auth_client, second_auth_client, sample_pdf):
        up_res = auth_client.post(reverse("library-files"), {"file": sample_pdf}, format="multipart")
        file_id = up_res.data["id"]

        serve_url = reverse("library-file-serve", kwargs={"pk": file_id})
        response = second_auth_client.get(serve_url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_serve_unauthenticated(self, api_client, test_user, sample_pdf):
        user_file = UserFile.objects.create(
            user=test_user,
            title="Doc",
            file=sample_pdf,
            file_type="PDF",
            size=100,
        )
        serve_url = reverse("library-file-serve", kwargs={"pk": user_file.id})
        response = api_client.get(serve_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUserReadingData:
    """Tests for GET & PATCH /api/library/files/<pk>/data/."""

    def test_get_reading_data_auto_create(self, auth_client, sample_pdf):
        up_res = auth_client.post(reverse("library-files"), {"file": sample_pdf}, format="multipart")
        file_id = up_res.data["id"]

        data_url = reverse("library-reading-data", kwargs={"pk": file_id})
        response = auth_client.get(data_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["progress"] == 0.0
        assert response.data["pdf_page"] == 1
        assert response.data["bookmarked"] is False
        assert response.data["highlights"] == []
        assert response.data["notes"] == []

    def test_patch_reading_data_updates(self, auth_client, sample_pdf):
        up_res = auth_client.post(reverse("library-files"), {"file": sample_pdf}, format="multipart")
        file_id = up_res.data["id"]

        data_url = reverse("library-reading-data", kwargs={"pk": file_id})
        patch_payload = {
            "progress": 72.5,
            "pdf_page": 15,
            "bookmarked": True,
            "highlights": [{"id": "h1", "text": "Important highlight"}],
            "notes": [{"text": "Key takeaway", "ts": "2026-09-29"}],
        }
        response = auth_client.patch(data_url, patch_payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["progress"] == 72.5
        assert response.data["pdf_page"] == 15
        assert response.data["bookmarked"] is True
        assert len(response.data["highlights"]) == 1
        assert response.data["highlights"][0]["text"] == "Important highlight"
        assert len(response.data["notes"]) == 1

    def test_reading_data_other_user_file_returns_404(self, auth_client, second_auth_client, sample_pdf):
        up_res = auth_client.post(reverse("library-files"), {"file": sample_pdf}, format="multipart")
        file_id = up_res.data["id"]

        data_url = reverse("library-reading-data", kwargs={"pk": file_id})
        response = second_auth_client.get(data_url)
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestS3StorageCompatibility:
    """Verifies that UserFile deletion and serving handle storages without local .path (such as S3)."""

    def test_delete_without_local_path(self, test_user, sample_pdf):
        from unittest.mock import patch, PropertyMock
        user_file = UserFile.objects.create(
            user=test_user,
            title="S3 Mocked Doc",
            file=sample_pdf,
            file_type="PDF",
            size=120,
        )
        file_id = user_file.id
        # When file.path raises NotImplementedError (like S3Boto3Storage), delete() succeeds cleanly
        with patch.object(type(user_file.file), "path", new_callable=PropertyMock) as mock_path:
            mock_path.side_effect = NotImplementedError("This backend doesn't support absolute paths.")
            user_file.delete()
            assert not UserFile.objects.filter(id=file_id).exists()


