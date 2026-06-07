from app.ai.workflows.fir_extraction import build_fir_workflow
from app.ai.rag.vector_search import VectorStore

def test_fir_extraction_workflow():
    workflow = build_fir_workflow()
    initial_state = {
        "raw_text": "On 12-05-2023 night, a theft occurred at MG Road where unknown male stole a vehicle KA-01-AB-1234.",
        "summary": "",
        "entities": {},
        "modus_operandi": "",
        "status": "started"
    }
    
    final_state = workflow.invoke(initial_state)
    
    assert final_state["status"] == "completed"
    assert "summary" in final_state["summary"].lower()
    assert final_state["entities"]["locations"][0] == "MG Road"
    assert "Night-time" in final_state["modus_operandi"]

def test_vector_search_mock():
    store = VectorStore()
    results = store.semantic_search("theft on brigade road")
    
    assert len(results) == 2
    assert results[0]["similarity"] > 0.9
    assert results[0]["doc_id"] == "fir-2023-001"
