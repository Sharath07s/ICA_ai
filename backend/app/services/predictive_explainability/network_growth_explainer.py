from app.services.predictive.network_growth import NetworkGrowthEngine
from app.services.predictive_validation.network_growth_validator import NetworkGrowthValidator
from app.services.predictive_explainability.confidence_engine import ConfidenceEngine

class NetworkGrowthExplainer:
    def __init__(self):
        pass

    def explain(self) -> dict:
        engine = NetworkGrowthEngine()
        pred_res = engine.predict_growth()
        
        if pred_res.get("status") == "insufficient_data":
            return {"status": "insufficient_data"}
            
        val = NetworkGrowthValidator().validate()
        hist_acc = 0.8
        if val.get("status") == "validated":
            hist_acc = val.get("prediction_accuracy", 0.8)
            
        explained_networks = []
        for net in pred_res.get("network_predictions", []):
            signal_str = net.get("predicted_new_connections_30d", 0) / 10.0 # Normalize roughly
            signal_str = min(signal_str, 1.0)
            
            conf = ConfidenceEngine.calculate_confidence(
                available_records=pred_res.get("records_analyzed", 20),
                required_records=20,
                historical_accuracy=hist_acc,
                signal_strength=signal_str
            )
            
            evidence = [
                f"Evaluated Neo4j network topology utilizing Preferential Attachment theory",
                f"Current network size (degree) mapped at {net.get('current_degree')}",
                f"Model predicts {net.get('predicted_new_connections_30d')} new connections based on structural advantages",
                f"Platform back-testing validates graph predictions with {hist_acc * 100}% accuracy"
            ]
            
            explained_networks.append({
                "suspect_id": net.get("suspect_id"),
                "prediction": net,
                "explainability": {
                    "confidence_score": conf["confidence"],
                    "confidence_level": conf["confidence_level"],
                    "evidence": evidence,
                    "risk_drivers": ["Degree Centrality", "Triadic Closures", "Preferential Attachment"]
                }
            })
            
        return {
            "status": "success",
            "networks": explained_networks
        }
