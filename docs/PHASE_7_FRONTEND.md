# Phase 7: Frontend Development

## Decisions Made

1. **Framework & Architecture:**
   - Bootstrapped with Next.js 15+ App Router (`src/app/` directory).
   - Designed a responsive UI using TailwindCSS aligned with modern, accessible government portals.

2. **State Management & Caching:**
   - **Zustand:** Implemented a lightweight global store (`authStore.ts`) synced with `localStorage` (via persist middleware) to retain the JWT token and user profile globally without context drilling.
   - **TanStack React Query:** Implemented fetching hooks (e.g., `useCrimes.ts`) to manage server state. This guarantees automatic background refetching, cache invalidation, and standardizes error/loading states against the FastAPI backend.

3. **Core Pages Generated:**
   - **Login (`/login`):** Secured entry point that accepts credentials, calls the FastAPI OAuth2 endpoint, and delegates the JWT to Zustand.
   - **Dashboard (`/dashboard`):** The primary view for officers showing summary metrics, mapped crime integrations, and an active FIR feed utilizing `useCrimes()`.
   - **AI Assistant Chat (`/ai-assistant`):** Built a conversational interface mapped to the `/chat` API endpoint, integrating dynamic typing indicators and distinguishing between user and assistant roles.
   - **Visualizations (`/crime-map`, `/knowledge-graph`):** Scaffolded skeleton pages ready for Leaflet and D3/ForceGraph implementations.

4. **Testing:**
   - Frontend tests would be orchestrated using Jest and React Testing Library, mocking `fetch` and Zustand stores to validate authentication flow and dashboard rendering.
