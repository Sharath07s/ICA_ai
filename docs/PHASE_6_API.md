# Phase 6: API Development

## Decisions Made

1. **REST API Design & Versioning:**
   - Adhered strictly to RESTful conventions.
   - Built under the `/api/v1/` prefix (configured in `main.py`).

2. **OpenAPI / Swagger Documentation:**
   - Leveraged FastAPI's native capabilities to auto-generate the OpenAPI (Swagger) schema at `/api/v1/openapi.json` and `/docs`.
   - Used Pydantic models extensively to ensure the Swagger documentation reflects strict validation criteria for request/response bodies.

3. **Data Transfer Objects (Pydantic Schemas):**
   - Implemented schemas in `backend/app/schemas/`.
   - Separated input (`Create`, `Update`) from output (`InDBBase`, `Crime`, `ChatResponse`) to ensure sensitive data is not leaked and inputs are strictly validated.
   - E.g. `CrimeCreate`, `ChatQuery`.

4. **API Routers:**
   - Built the modular routers in `backend/app/api/v1/`:
     - `crimes.py`: Endpoints for fetching, listing, and creating FIR records. Uses the generic `crime_repo`.
     - `chat.py`: Exposes the AI conversation endpoint. Integrates with the Provider Factory created in Phase 3.
     - `investigations.py`: Foundation for investigation tracking.
   - Bound all routers efficiently in `backend/app/api/v1/api.py`.

5. **Testing:**
   - Wrote `test_api.py` validating that the FastAPI app correctly builds and serves the OpenAPI schema, verifying that all routed endpoints are correctly formed without syntax errors.
