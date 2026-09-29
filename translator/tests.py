from unittest.mock import MagicMock, patch
import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestTranslateText:
    """Tests for POST /api/translator/translate/ endpoint."""

    translate_url = reverse("translate_text")

    def test_translate_unauthenticated(self, api_client):
        response = api_client.post(self.translate_url, {"text": "Hello"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_translate_empty_text(self, auth_client):
        response = auth_client.post(self.translate_url, {"text": ""})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "No text provided" in response.data["error"]

    @patch("translator.views.GoogleTranslator")
    def test_translate_success_default_target(self, mock_translator_cls, auth_client):
        mock_instance = MagicMock()
        mock_instance.translate.return_value = "ನಮಸ್ಕಾರ"
        mock_translator_cls.return_value = mock_instance

        payload = {"text": "Hello"}
        response = auth_client.post(self.translate_url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["translated_text"] == "ನಮಸ್ಕಾರ"
        mock_translator_cls.assert_called_once_with(source="auto", target="kn")
        mock_instance.translate.assert_called_once_with("Hello")

    @patch("translator.views.GoogleTranslator")
    def test_translate_custom_target_lang(self, mock_translator_cls, auth_client):
        mock_instance = MagicMock()
        mock_instance.translate.return_value = "Hola"
        mock_translator_cls.return_value = mock_instance

        payload = {"text": "Hello", "target": "es"}
        response = auth_client.post(self.translate_url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["translated_text"] == "Hola"
        mock_translator_cls.assert_called_once_with(source="auto", target="es")

    @patch("translator.views.GoogleTranslator")
    def test_translate_error_handling(self, mock_translator_cls, auth_client):
        mock_instance = MagicMock()
        mock_instance.translate.side_effect = Exception("Translation service unreachable")
        mock_translator_cls.return_value = mock_instance

        payload = {"text": "Hello"}
        response = auth_client.post(self.translate_url, payload, format="json")
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert "Translation service unreachable" in response.data["error"]
