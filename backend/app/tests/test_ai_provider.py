import pytest
from app.ai.provider import get_ai_provider, OpenAIProvider, GeminiProvider

def test_get_openai_provider():
    provider = get_ai_provider("openai", openai_api_key="fake-key")
    assert isinstance(provider, OpenAIProvider)
    assert provider.api_key == "fake-key"

def test_get_gemini_provider():
    provider = get_ai_provider("gemini", gemini_api_key="fake-key")
    assert isinstance(provider, GeminiProvider)
    assert provider.api_key == "fake-key"

def test_unsupported_provider():
    with pytest.raises(ValueError):
        get_ai_provider("unknown_provider")
