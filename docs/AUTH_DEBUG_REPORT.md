# Authentication Debugging Audit Report

## 1. Root Cause Summary
The issue where the frontend Chat UI threw `Authentication failed. Please log in again.` (Triggered by a `401`/`403` HTTP status code) was caused by a combination of two main issues:
1. **Frontend Mock Token:** The frontend login process (`src/app/login/page.tsx`) was simulating a login delay and issuing a fake JWT token (`"mock-jwt-token-kcia-2026-auth"`). This token was being stored in Zustand's persisted state, but it was **never** being attached to the outgoing request headers in `chat.service.ts`.
2. **Backend Authentication Enforcement:** The `/api/v1/chat/` endpoint (in `app/api/v1/chat.py`) was protected by `Depends(deps.get_current_active_user)`. When `chat.service.ts` attempted to hit the endpoint without a Bearer token, the backend correctly rejected the request with a `401 Unauthorized`.

Additionally, the backend Database Seeding script was creating mock users with the literal string `"hashed_password"` instead of a proper `bcrypt` hash, rendering all seeded users unable to actually log in to obtain a real token. Finally, required LangChain provider libraries were missing from the backend requirements, preventing the chat from working even if authenticated.

---

## 2. Request Trace
- **Frontend**
  - **Login:** User entered credentials on `/login`. The form used a simulated timeout to issue a fake token.
  - **Chat Send:** User navigated to `/ai-assistant` and typed a message.
  - **Axios Request:** `chatService.sendMessage` was invoked. It sent a `POST` to `${API_BASE_URL}/chat/` with `{ query: message }`. No `Authorization` header was attached.
- **Backend API Gateway (FastAPI)**
  - **Route Match:** `POST /api/v1/chat/`
  - **Security Dependency:** The router depended on `deps.get_current_active_user`, which parses the JWT from the `Authorization: Bearer <token>` header.
  - **Failure Point:** No token was present in the header. `deps.get_current_active_user` immediately raised `HTTPException(401, "Not authenticated")`.
- **Frontend Error Handler**
  - `axios.isAxiosError` intercepted the 401 response.
  - The condition `if (axiosError.response.status === 401 || ...)` matched and threw: `"Authentication failed. Please log in again."`.

---

## 3. Files Modified

| File | Changes Made |
|------|--------------|
| `frontend/src/app/login/page.tsx` | Replaced mock authentication logic (`setTimeout`) with an actual API call to the backend using `authService.login()`. |
| `frontend/src/services/auth.service.ts` | **(NEW)** Created a dedicated service to send `username` (badge number) and `password` via `application/x-www-form-urlencoded` to `POST /api/v1/auth/login`. |
| `frontend/src/services/chat.service.ts` | Extracted the saved JWT token from `localStorage` (`kcia-auth-storage`) and attached it as `Authorization: Bearer <token>` in the Axios POST request to `/chat/`. |
| `backend/scripts/seed_database.py` | Fixed password seeding logic. Imported `security` and replaced `"hashed_password"` with `security.get_password_hash("password123")`. Fixed a unique constraint collision on `fir_number` generation. |
| `backend/requirements.txt` | Added `langchain-openai`, `langchain-google-genai`, and `langchain-anthropic` to resolve backend 500 errors. |
| `backend/app/api/v1/chat.py` | Ensured `current_user: User = Depends(deps.get_current_active_user)` remains correctly applied to protect the route. |

---

## 4. Test Results

### Backend Re-Seeding
The database was successfully re-seeded (`scripts/seed_database.py --reset`). Users were populated with functional bcrypt password hashes.

### Login Flow Test
Performed an end-to-end `POST` request to `/api/v1/auth/login` using the newly seeded admin credentials:
```bash
username=ADM001&password=password123
```
**Result:** Passed. Backend returned a valid JWT structure:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer"
}
```

### Protected Route Test
Extracted the real JWT token and submitted a simulated chat request:
```bash
curl -X POST http://localhost:8000/api/v1/chat/ \
  -H "Authorization: Bearer <Real_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"query": "hello"}'
```
**Result:** The `401 Unauthorized` issue is **resolved**. The endpoint properly accepted the token and authenticated the user. 
*(Note: It then safely proceeded to return a `500` regarding OpenAI "Insufficient Balance", proving the execution successfully passed the auth middleware and executed the AI provider logic).*

---

## 5. Remaining Issues (Outside Auth Scope)
- **OpenAI/Gemini API Key Balances:** The underlying AI model providers currently return an `Insufficient Balance` error when attempting to generate a response. You will need to supply an active, funded API key in your `.env` file (e.g. `OPENAI_API_KEY`) to complete the final generation step.
