# Phase 8: AI & Analytics Layer

## Decisions Made

1. **Framework Choice:**
   - **LangGraph:** Selected to orchestrate stateful, multi-step agentic workflows. It provides deterministic graphs (`StateGraph`) allowing complex pipelines like parsing, summarizing, and querying to happen sequentially or conditionally with defined schemas.
   - **LangChain Core:** Used for `PromptTemplate` and output parsing configurations dynamically connecting to the AI Provider factory implemented in Phase 3.

2. **Workflows Implemented:**
   - **FIR Extraction Pipeline:** Created `app/ai/workflows/fir_extraction.py` which passes a `ExtractionState` dictionary through three nodes:
     1. **`summarize_fir`**: Generates a fast, high-level summary.
     2. **`extract_entities`**: Enforces structured Pydantic schema generation (`ExtractedEntities`) to map unstructured text directly to DB domains (Suspects, Victims, Vehicles, Locations).
     3. **`match_modus_operandi`**: Cross-references the extracted behavioral markers against historical embeddings.

3. **RAG & Vector Integration:**
   - Designed `app/ai/rag/vector_search.py` implementing `VectorStore`.
   - Native integration path designed for `PGVector`, ensuring that semantic representations of FIR texts, MOs, and physical descriptions live alongside structured transactional data, minimizing latency.

4. **Testing:**
   - Created `test_ai_workflows.py` ensuring the LangGraph workflow compiles, executes sequentially, updates state as expected, and resolves to the `END` state correctly.
