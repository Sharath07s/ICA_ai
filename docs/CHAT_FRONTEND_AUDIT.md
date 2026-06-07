# Frontend Chat Audit Report

## Phase 1A Findings

**Target Directory:** `frontend/src/app/ai-assistant/`
**File Analyzed:** `page.tsx`

| Issue | Line Numbers | Description | Severity |
| :--- | :--- | :--- | :--- |
| `setTimeout` usage | 103-201 | The `executeSearch` function uses a `setTimeout` of 1800ms to artificially delay the response, mimicking network latency and processing time. | High |
| Hardcoded Responses | 104-195 | The responses are statically defined within the code rather than being fetched from a backend source. | High |
| Keyword Matching | 112-195 | The code uses simple `if/else if` blocks matching keywords like `"burglary"`, `"vicky"`, and `"offender"` to determine which hardcoded response to return. | High |
| Fake Confidence Scores | 128, 156, 185 | The `confidence` property in `xaiDetails` is hardcoded to specific values (e.g., 88, 94, 76) for each matched scenario. | High |
| Fake Evidence Sources | 129-133, 157-161, 186-189 | The `sources` array in `xaiDetails` contains hardcoded strings pointing to fake data sources. | High |
| Fake Reasoning Chains | 134-138, 162-166, 190-193 | The `reasoning` array in `xaiDetails` contains hardcoded explanatory text. | High |
| Mock Data (Visuals) | 118-125, 146-153, 174-182 | `intelData` containing charts, maps, and network links are completely statically defined and returned with specific keywords. | High |

### Action Plan
1. Remove the entire `setTimeout` block inside `executeSearch`.
2. Remove all hardcoded `if/else` keyword matching.
3. Remove the generation of mock `intelData` and `xaiDetails`.
4. Connect the `executeSearch` function to the newly created `chat.service.ts` API client.
