import httpx
import os
import logging

logger = logging.getLogger(__name__)

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://localhost:8000/api/ml/pipeline")

async def get_prediction_from_ml_service(transaction_data: dict) -> dict:
    """
    Proxies requests to the existing ML server at ML_SERVICE_URL.
    DO NOT IMPLEMENT PREDICTION LOGIC HERE.
    This just calls the user's existing model.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ML_SERVICE_URL,
                json=transaction_data,
                timeout=10.0
            )
            response.raise_for_status()
            # Expecting the existing ML service to return:
            # { "fraud_probability": 0.85, "risk_level": "HIGH", "cash_out_prediction": ... }
            return response.json()
    except httpx.HTTPError as e:
        logger.error(f"Error calling ML service: {e}")
        # Return a fallback/error response so the LEA portal doesn't crash
        return {
            "status": "error",
            "message": "Failed to connect to the ML intelligence service.",
            "riskLevel": "UNKNOWN",
            "confidence": 0.0
        }
