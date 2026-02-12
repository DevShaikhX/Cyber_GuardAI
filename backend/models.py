from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

# Email Data Models
class EmailInput(BaseModel):
    sender_email: str
    recipient_email: str
    subject: str
    body: str
    urls: List[str]

    @validator('sender_email', 'recipient_email')
    def validate_email(cls, v):
        if "@" not in v:
            raise ValueError('Invalid email format')
        return v

class EmailPrediction(BaseModel):
    phishing_probability: float
    flagged_sections: List[str]
    explanation: str

# Network Log Models
class NetworkLogInput(BaseModel):
    timestamp: Optional[str] = None
    source_ip: str
    destination_ip: str
    source_port: int
    destination_port: int
    protocol: str
    packet_count: int

    @validator('source_port', 'destination_port')
    def validate_ports(cls, v):
        if not (0 <= v <= 65535):
            raise ValueError('Port must be between 0 and 65535')
        return v

class AnomalyPrediction(BaseModel):
    anomaly_score: float
    risk_level: str
    suspicious_activity_description: str

# Ransomware Models
class RansomwareInput(BaseModel):
    process_name: str
    file_path: str
    file_hash: str
    suspicious_activity: str

class RansomwarePrediction(BaseModel):
    risk_level: str
    explanation: str
    flagged_sections: List[str]

# DDoS Models
class DDoSInput(BaseModel):
    target_ip: str
    traffic_volume: int
    protocol: str
    attack_type: str

class DDoSPrediction(BaseModel):
    risk_level: str
    explanation: str
    flagged_sections: List[str]

# Database Models (shared)
class ResultEntry(BaseModel):
    id: Optional[int] = None
    type: str # 'email' or 'network'
    timestamp: datetime
    input_data: dict
    prediction: dict
