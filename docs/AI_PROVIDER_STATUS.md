# AI Provider Status Audit

| Provider | Status | Latency | Error Details | Model Used |
|---|---|---|---|---|
| **Groq** | ❌ Failed | N/A | Missing `GROQ_API_KEY` in environment variables. Skipped by fallback manager. | `llama-3.3-70b-versatile` |
| **Gemini** | ❌ Failed | ~1s | `404 NOT_FOUND` for `models/gemini-pro` and `gemini-1.5-pro`. Key may be restricted or invalid for the API version (`v1beta`). | `gemini-pro` / `gemini-1.5-pro` |
| **OpenAI** | ❌ Failed | ~1s | `429 You exceeded your current quota`. The provided key has insufficient quota. | `gpt-4o` |
| **DeepSeek** | ❌ Failed | ~1.5s | `402 Insufficient Balance`. The provided key has insufficient balance. | `deepseek-chat` |

## Summary
All AI providers are currently failing due to invalid keys, insufficient quota, or missing keys. The fallback system correctly iterates through Groq -> Gemini -> OpenAI -> DeepSeek, but all raise exceptions. 
**Blocker:** Valid, funded API keys are required for the AI Intent Extraction to successfully execute.
