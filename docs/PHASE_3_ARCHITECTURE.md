# Phase 3: Architecture Generation

## Decisions Made

1. **Frontend Architecture:**
   - **Framework:** Next.js (App Router) initialized with TypeScript, TailwindCSS, and ESLint.
   - **State Management:** Integrated Zustand for predictable global state management and TanStack React Query for powerful data fetching/caching logic.
   - **UI Library:** Integrated Shadcn UI to easily construct government-grade components.

2. **Backend Architecture:**
   - **Framework:** FastAPI initialized with Pydantic for validation and settings management.
   - **Structure:** Defined standard directories (`api/v1`, `core`, `db`, `models`, `schemas`, `services`, `ai`, `tests`).
   - **Configuration:** Created `core/config.py` leveraging `pydantic-settings` to securely load env variables (Postgres, Keys).

3. **AI Layer Provider Abstraction:**
   - **Abstraction:** Implemented an abstract base class `AIProvider` to abstract away specific LLM clients.
   - **Implementations:** Created `OpenAIProvider`, `GeminiProvider`, `ClaudeProvider`, and `DeepSeekProvider` using LangChain to wrap each API.
   - **Factory:** Created `get_ai_provider` factory to configure the model dynamically using the `.env` settings.

4. **Testing Infrastructure:**
   - **Backend Tests:** Set up `pytest` with a basic `test_main.py` testing the API health checks and `test_ai_provider.py` testing the AI Provider factory logic.
