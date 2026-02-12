from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime
from typing import List

from .database import get_db, DetectionResult
from .models import (
    EmailInput, EmailPrediction, 
    NetworkLogInput, AnomalyPrediction, 
    RansomwareInput, RansomwarePrediction,
    DDoSInput, DDoSPrediction,
    ResultEntry
)
from .ai_engine import phishing_engine, anomaly_engine

app = FastAPI(title="CyberGuard AI API")
api_router = APIRouter()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@api_router.post("/submit-email", response_model=EmailPrediction)
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

@api_router.post("/submit-network-log", response_model=AnomalyPrediction)
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

@api_router.post("/submit-ransomware", response_model=RansomwarePrediction)
def submit_ransomware(data: RansomwareInput, db: Session = Depends(get_db)):
    try:
        # Mocking Ransomware Analysis logic
        risk = "high" if "encrypt" in data.suspicious_activity.lower() or "bitcoin" in data.suspicious_activity.lower() else "medium"
        flagged = ["Encryption Pattern"] if risk == "high" else ["Suspicious I/O"]
        explanation = f"Detected {risk} risk ransomware activity in process {data.process_name}. Pattern matches known locker behaviors."
        
        prediction = {
            "risk_level": risk,
            "explanation": explanation,
            "flagged_sections": flagged
        }

        # Store in DB
        result = DetectionResult(
            type="ransomware",
            input_data=data.dict(),
            prediction=prediction
        )
        db.add(result)
        db.commit()
        return prediction
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/submit-ddos", response_model=DDoSPrediction)
def submit_ddos(data: DDoSInput, db: Session = Depends(get_db)):
    try:
        # Mocking DDoS Analysis logic
        risk = "high" if data.traffic_volume > 5000 else "medium" if data.traffic_volume > 1000 else "low"
        flagged = ["Volumetric Threshold Exceeded"] if risk == "high" else ["Unusual Traffic Spikes"]
        explanation = f"Detected {risk} risk DDoS {data.attack_type} on {data.target_ip}. Current volume: {data.traffic_volume} req/sec via {data.protocol}."
        
        prediction = {
            "risk_level": risk,
            "explanation": explanation,
            "flagged_sections": flagged
        }

        # Store in DB
        result = DetectionResult(
            type="ddos",
            input_data=data.dict(),
            prediction=prediction
        )
        db.add(result)
        db.commit()
        return prediction
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/get-results", response_model=List[ResultEntry])
def get_results(limit: int = 20, db: Session = Depends(get_db)):
    results = db.query(DetectionResult).order_by(DetectionResult.timestamp.desc()).limit(limit).all()
    return results

@api_router.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.datetime.utcnow()}

# Include the router in the app
app.include_router(api_router, prefix="/api")
# Fallback: Include router at root in case Vercel strips the prefix
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
