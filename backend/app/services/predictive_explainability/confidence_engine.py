class ConfidenceEngine:
    @staticmethod
    def calculate_confidence(
        available_records: int, 
        required_records: int, 
        historical_accuracy: float = 0.8,
        signal_strength: float = 0.5
    ) -> dict:
        """
        Converts raw predictive metrics into a transparent confidence score.
        Score = (Volume Ratio * 0.4) + (Historical Accuracy * 0.4) + (Signal Strength * 0.2)
        """
        if available_records < required_records:
            return {
                "confidence": 0,
                "confidence_level": "NONE",
                "status": "insufficient_data"
            }
            
        # Volume ratio capped at 1.5x requirement
        volume_ratio = min(available_records / required_records, 1.5) / 1.5
        
        # Weighted calculation
        raw_score = (volume_ratio * 0.4) + (historical_accuracy * 0.4) + (signal_strength * 0.2)
        
        # Convert to 0-100 scale
        confidence_percent = min(max(int(raw_score * 100), 0), 100)
        
        level = "LOW"
        if confidence_percent > 80:
            level = "HIGH"
        elif confidence_percent > 50:
            level = "MEDIUM"
            
        return {
            "status": "success",
            "confidence": confidence_percent,
            "confidence_level": level
        }
