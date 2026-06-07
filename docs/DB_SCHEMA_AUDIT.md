# Database Schema Audit

## Overview
This document outlines the findings of the schema validation step (Phase 3A), comparing the expected backend schema defined in `BACKEND_SCHEMA.md` and the Phase 3 requirements against the actual SQLAlchemy models in `backend/app/models/`.

## Key Findings

### 1. Missing Fields in `crimes` Table
- **`estimated_loss`**: The `estimated_loss` field was requested for Phase 3D (CRIME DATA GENERATION) but was not present in `BACKEND_SCHEMA.md` or `backend/app/models/crime.py`.
- **`created_by`**: Present in `BACKEND_SCHEMA.md` but missing from the implementation in `backend/app/models/crime.py`.

### 2. General Alignments
- All core tables (`districts`, `police_stations`, `crime_types`, `crimes`, `suspects`, `vehicles`, `victims`) are properly defined and relationship integrity relies on SQLAlchemy's `relationship` and `ForeignKey` primitives.
- Indexes are generally present on appropriate fields like `fir_number`, `station_code`, and foreign keys.

### 3. Missing Structural Metadata mappings
- Phase 3D requested `severity` and `crime_category` on the `crimes` themselves, but structurally in our codebase these belong to `crime_types` as `severity_level` and `category`. This is a normalized design and acceptable, but requires the seeder to map these values into `crime_types` accurately so they can be queried alongside the `crimes`.

## Recommended Changes
1. **Update `models/crime.py`**: Add `estimated_loss = Column(Numeric)` to the `Crime` model to track financial impact.
2. **Update `models/crime.py`**: Add `created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))` to map the record creation to a user/officer.
3. Ensure the seeding script accounts for these relational dependencies by creating users before assigning them to crimes.
