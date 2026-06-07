# Phase 5: Authentication

## Decisions Made

1. **Token Strategy:**
   - **JWT Access Tokens:** Implemented short-lived JSON Web Tokens (JWT) for stateless API authentication (`ACCESS_TOKEN_EXPIRE_MINUTES`).
   - **Refresh Tokens:** Added long-lived refresh tokens allowing users to maintain sessions without re-authenticating while keeping access tokens short-lived for security.
   - **MFA Readiness:** Added utility `create_mfa_token` to support Multi-Factor Authentication pending flows, satisfying the PRD security requirements.

2. **Password Security:**
   - Integrated `passlib` with `bcrypt` for secure hashing and salting of passwords.

3. **FastAPI Dependency Injection (Middleware equivalent):**
   - Implemented `get_current_user` to automatically validate JWTs on protected routes.
   - Implemented `get_current_active_user` to restrict access for deactivated accounts.
   - Implemented `RoleChecker` as an RBAC policy dependency.

4. **Role-Based Access Control (RBAC):**
   - The `RoleChecker` dynamic dependency allows endpoints to easily enforce policy logic:
     `Depends(RoleChecker(["SCRB Admin", "SP"]))`
   - Maps to the roles defined in the Phase 4 database implementation (`Constable`, `SI`, `Inspector`, `SP`, `SCRB Admin`).

5. **API Endpoints:**
   - Built `/api/v1/auth/login` returning standard OAuth2 Bearer tokens.
   - Built `/api/v1/auth/refresh` to exchange refresh tokens for new access tokens.
   - Built `/api/v1/users/me` and `/api/v1/users/admin-only` to demonstrate protected and role-restricted endpoints.

6. **Testing:**
   - Verified the behavior of `bcrypt` password hashing.
   - Verified the correct signature, encoding, and decoding behavior of Access and Refresh JWT tokens in `test_auth.py`.
