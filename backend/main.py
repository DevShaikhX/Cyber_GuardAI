from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime

from .database import get_db, DetectionResult
from .models import EmailInput, EmailPrediction, NetworkLogInput, AnomalyPrediction, ResultEntry
from .ai_engine import phishing_engine, anomaly_engine

app = FastAPI(title="CyberGuard AI API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/submit-email", response_model=EmailPrediction)
def submit_email(data: EmailInput, db: Session = Depends(get_db)):
    try:
        # Retry logic: try once, then retry once more if it fails
        max_retries = 2
        for attempt in range(max_retries):
            try:
                prob, flagged, explanation = phishing_engine.analyze(
                    data.body, data.urls, data.sender_email, data.subject
                )
                break 
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                continue
        
        prediction = {
            "phishing_probability": prob,
            "flagged_sections": flagged,
            "explanation": explanation
        }

        # Store in DB
        result = DetectionResult(
            type="email",
            input_data=data.dict(),
            prediction=prediction
        )
        db.add(result)
        db.commit()
        
        return prediction
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/submit-network-log", response_model=AnomalyPrediction)
def submit_network_log(data: NetworkLogInput, db: Session = Depends(get_db)):
    try:
        # Retry logic
        max_retries = 2
        for attempt in range(max_retries):
            try:
                score, risk, desc = anomaly_engine.analyze(
                    data.source_port, data.destination_port, data.packet_count, data.protocol
                )
                break
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                continue
        
        prediction = {
            "anomaly_score": score,
            "risk_level": risk,
            "suspicious_activity_description": desc
        }

        # Store in DB
        result = DetectionResult(
            type="network",
            input_data=data.dict(),
            prediction=prediction
        )
        db.add(result)
        db.commit()
        
        return prediction
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/get-results")
def get_results(limit: int = 20, db: Session = Depends(get_db)):
    results = db.query(DetectionResult).order_by(DetectionResult.timestamp.desc()).limit(limit).all()
    return results

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
