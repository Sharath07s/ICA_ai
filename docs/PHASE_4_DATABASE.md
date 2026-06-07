# Phase 4: Database Implementation

## Decisions Made

1. **SQLAlchemy Base & Mixins:**
   - Implemented `TimestampMixin` for automatic `created_at` and `updated_at` timestamps.
   - Implemented `SoftDeleteMixin` for `is_deleted` flags to preserve historical crime records without physical deletion.
   - Implemented `AuditMixin` for tracking `created_by` and `updated_by`.
   - Created a foundational `BaseModel` inheriting these mixins and defining a default UUID primary key.

2. **Entity Models (PostgreSQL Schema):**
   - Implemented `User`, `Role`, `Permission`, `PoliceStation`, and `District` for the IAM and location layer.
   - Implemented `Crime`, `CrimeType`, `CrimeStatusHistory` for core operations.
   - Implemented multi-faceted relational entities: `Suspect`, `Victim`, `Vehicle`, `Evidence` with association tables for linking them to `crimes` with specific roles.
   - Implemented `Investigation` and `InvestigationNote`.
   - Implemented analytics logging: `Report`, `CrimePrediction`, `HotspotAnalysis`, `AIConversation`, `AIMessage`, `AIQueryLog`, `AuditLog`, and `Notification`.

3. **Database Migration Pipeline:**
   - Initialized `alembic` to automatically track schema changes against the PostgreSQL database.

4. **Service & Repository Patterns:**
   - Abstracted database operations behind `BaseRepository[ModelType]` to ensure standard behavior (especially enforcing soft-deletes natively during `get` and `delete`).
   - Created a generic `BaseService[RepoType, ModelType]` to inject repository dependencies logically.
   
5. **Testing Strategy:**
   - Deployed `pytest` tests using an in-memory SQLite database to confirm model instantiations, relations, and soft-delete business logic inside the repository pattern.
