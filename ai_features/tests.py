from unittest.mock import MagicMock, patch
import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestSimplifyView:
    """Tests for POST /api/ai/simplify/."""

    simplify_url = reverse("ai-simplify")

    def test_simplify_unauthenticated(self, api_client):
        response = api_client.post(self.simplify_url, {"text": "Complex text to simplify."})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_simplify_empty_text(self, auth_client):
        response = auth_client.post(self.simplify_url, {"text": "   "})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "No text provided" in response.data["error"]

    @patch("ai_features.views.call_ai_completion")
    def test_simplify_success(self, mock_completion, auth_client):
        mock_completion.return_value = "This is a simplified version of the text."
        response = auth_client.post(self.simplify_url, {"text": "Photosynthesis is the photochemical synthesis of carbohydrates."})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["simplified"] == "This is a simplified version of the text."
        mock_completion.assert_called_once()

    @patch("ai_features.views.call_ai_completion")
    def test_simplify_timeout_error(self, mock_completion, auth_client):
        mock_completion.side_effect = Exception("Groq request timed out.")
        response = auth_client.post(self.simplify_url, {"text": "Some text"})
        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
        assert "timed out" in response.data["error"].lower()


@pytest.mark.django_db
class TestStructureView:
    """Tests for POST /api/ai/structure/."""

    structure_url = reverse("ai-structure")

    def test_structure_unauthenticated(self, api_client):
        response = api_client.post(self.structure_url, {"text": "Some long paragraph."})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_structure_empty_text(self, auth_client):
        response = auth_client.post(self.structure_url, {"text": ""})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "No text provided" in response.data["error"]

    @patch("ai_features.views.call_ai_completion")
    def test_structure_success(self, mock_completion, auth_client):
        mock_completion.return_value = "• Point 1: Introduction\n• Point 2: Main argument"
        response = auth_client.post(self.structure_url, {"text": "A full article paragraph here."})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["structured"] == "• Point 1: Introduction\n• Point 2: Main argument"
        mock_completion.assert_called_once()


@pytest.mark.django_db
class TestExplainWordView:
    """Tests for POST /api/ai/explain/."""

    explain_url = reverse("ai-explain")

    def test_explain_unauthenticated(self, api_client):
        response = api_client.post(self.explain_url, {"word": "cognitive"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_explain_empty_word(self, auth_client):
        response = auth_client.post(self.explain_url, {"word": "   "})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "No word provided" in response.data["error"]

    @patch("ai_features.views.requests.get")
    def test_explain_dictionary_api_success(self, mock_get, auth_client):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [
            {
                "phonetic": "/ˌkɒɡnɪtɪv/",
                "meanings": [
                    {
                        "partOfSpeech": "adjective",
                        "definitions": [
                            {
                                "definition": "Related to conscious intellectual activity.",
                                "example": "Cognitive skills develop early."
                            }
                        ]
                    }
                ]
            }
        ]
        mock_get.return_value = mock_resp

        response = auth_client.post(self.explain_url, {"word": "cognitive"})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["word"] == "cognitive"
        assert "Related to conscious intellectual activity" in response.data["explanation"]
        assert "/ˌkɒɡnɪtɪv/" in response.data["explanation"]

    @patch("ai_features.views.call_ai_completion")
    @patch("ai_features.views.requests.get")
    def test_explain_dictionary_fallback_to_ai(self, mock_get, mock_completion, auth_client):
        # Dictionary API returns 404
        mock_resp = MagicMock()
        mock_resp.status_code = 404
        mock_get.return_value = mock_resp

        # AI completes definition
        mock_completion.return_value = "[noun] Specialized term: A unique phenomenon."
        response = auth_client.post(self.explain_url, {"word": "specializedterm", "context": "In biology..."})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["word"] == "specializedterm"
        assert "Specialized term" in response.data["explanation"]

    @patch("ai_features.views.call_ai_completion")
    @patch("ai_features.views.requests.get")
    def test_explain_both_fail_returns_404(self, mock_get, mock_completion, auth_client):
        # Dictionary API fails
        mock_get.side_effect = Exception("Network error")
        # AI completion also fails
        mock_completion.side_effect = Exception("Groq unavailable")

        response = auth_client.post(self.explain_url, {"word": "unknownword123"})
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Definition not found" in response.data["error"]


@pytest.mark.django_db
class TestAgentOptimizeReadingView:
    """Tests for POST /api/ai/agent/optimize-reading/."""

    agent_url = reverse("agent-optimize-reading")

    def test_agent_optimize_unauthenticated(self, api_client):
        response = api_client.post(self.agent_url, {"text": "Sample text to optimize."})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_agent_optimize_with_text(self, auth_client):
        payload = {
            "text": "Neurodiversity is a concept where neurological differences are recognized and respected as any other human variation. These differences can include those labeled with Dyspraxia, Dyslexia, Attention Deficit Hyperactivity Disorder, and others.",
            "current_settings": {
                "font_size": "16px",
                "line_height": "1.5",
                "font_family": "Arial",
            }
        }
        response = auth_client.post(self.agent_url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert "readability_score" in response.data
        assert "difficulty_level" in response.data
        assert "recommended_settings" in response.data
        assert "actions_taken" in response.data
        assert isinstance(response.data["recommended_settings"], dict)
