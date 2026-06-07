import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from langchain_core.language_models.chat_models import BaseChatModel

logger = logging.getLogger(__name__)

class AIProvider(ABC):
    """Abstract base class for all AI providers."""
    
    @abstractmethod
    def get_chat_model(self, temperature: float = 0.0) -> BaseChatModel:
        """Return the initialized LangChain Chat Model."""
        pass
        
    @abstractmethod
    def generate_response(self, prompt: str, **kwargs) -> str:
        """Generate a direct text response."""
        pass

class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("OPENAI_API_KEY is required for OpenAIProvider")
        from langchain_openai import ChatOpenAI
        self.api_key = api_key
        # We can dynamically import inside methods or init

    def get_chat_model(self, temperature: float = 0.0) -> BaseChatModel:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(api_key=self.api_key, temperature=temperature, model="gpt-4o")

    def generate_response(self, prompt: str, **kwargs) -> str:
        model = self.get_chat_model()
        response = model.invoke(prompt)
        return response.content

class GeminiProvider(AIProvider):
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("GEMINI_API_KEY is required for GeminiProvider")
        self.api_key = api_key

    def get_chat_model(self, temperature: float = 0.0) -> BaseChatModel:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(google_api_key=self.api_key, temperature=temperature, model="gemini-1.5-pro")

    def generate_response(self, prompt: str, **kwargs) -> str:
        model = self.get_chat_model()
        response = model.invoke(prompt)
        return response.content

class ClaudeProvider(AIProvider):
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY is required for ClaudeProvider")
        self.api_key = api_key

    def get_chat_model(self, temperature: float = 0.0) -> BaseChatModel:
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(anthropic_api_key=self.api_key, temperature=temperature, model="claude-3-opus-20240229")

    def generate_response(self, prompt: str, **kwargs) -> str:
        model = self.get_chat_model()
        response = model.invoke(prompt)
        return response.content

class DeepSeekProvider(AIProvider):
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("DEEPSEEK_API_KEY is required for DeepSeekProvider")
        self.api_key = api_key

    def get_chat_model(self, temperature: float = 0.0) -> BaseChatModel:
        # DeepSeek can be integrated via ChatOpenAI client with different base URL
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            api_key=self.api_key, 
            base_url="https://api.deepseek.com/v1", 
            temperature=temperature, 
            model="deepseek-chat"
        )

    def generate_response(self, prompt: str, **kwargs) -> str:
        model = self.get_chat_model()
        response = model.invoke(prompt)
        return response.content

def get_ai_provider(provider_name: str, **kwargs) -> AIProvider:
    """Factory method to get the configured AI provider."""
    provider_name = provider_name.lower()
    
    if provider_name == "openai":
        return OpenAIProvider(api_key=kwargs.get("openai_api_key"))
    elif provider_name == "gemini":
        return GeminiProvider(api_key=kwargs.get("gemini_api_key"))
    elif provider_name == "claude":
        return ClaudeProvider(api_key=kwargs.get("anthropic_api_key"))
    elif provider_name == "deepseek":
        return DeepSeekProvider(api_key=kwargs.get("deepseek_api_key"))
    else:
        raise ValueError(f"Unsupported AI provider: {provider_name}")
