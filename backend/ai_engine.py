import random
import re
from typing import List, Tuple

# Lazy loading placeholders
pipeline = None
IsolationForest = None
np = None

class PhishingDetector:
    def __init__(self):
        self._classifier = None
        self._initialized = False

    def _ensure_initialized(self):
        if self._initialized:
            return
        
        global pipeline
        try:
            if pipeline is None:
                from transformers import pipeline
        except ImportError:
            pipeline = None
            pass

        if pipeline:
            try:
                self._classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
            except Exception:
                self._classifier = None
        
        self._initialized = True

    def analyze(self, body: str, urls: List[str], sender: str, subject: str) -> Tuple[float, List[str], str]:
        self._ensure_initialized()
        
        flagged = []
        score = 0.0
        
        # 1. URL Analysis
        suspicious_keywords = ["verify", "login", "account-update", "secure", "banking", "urgent", "gift"]
        for url in urls:
            if any(key in url.lower() for key in suspicious_keywords):
                flagged.append(f"Suspicious URL content: {url}")
                score += 25
            if len(url) > 100:
                flagged.append(f"Unusually long URL: {url[:50]}...")
                score += 10

        # 2. Sender Analysis
        if any(domain in sender.lower() for domain in ["@free-prize.com", "@security-verify.net", "@account-alert.io"]):
            flagged.append(f"Suspicious sender domain: {sender}")
            score += 40

        # 3. Content Analysis (Transformer or Heuristic)
        if self._classifier:
            try:
                # Truncate to avoid model limit
                result = self._classifier(body[:512])[0]
                # If negative sentiment + urgent keywords, it's a signal
                if result['label'] == 'NEGATIVE' and result['score'] > 0.8:
                    score += 30
                    flagged.append("Negative sentiment/Urgency detected by AI")
            except:
                pass
        
        # Heuristic Content Check
        urgent_pattern = r"(urgent|action required|suspended|immediate|limited time)"
        if re.search(urgent_pattern, (body + subject).lower()):
            flagged.append("Urgency/Scarcity language detected")
            score += 20

        # Normalize score
        final_probability = min(score, 100.0)
        
        explanation = "No major threats detected."
        if final_probability > 70:
            explanation = "High risk: Email contains multiple phishing signals including suspicious URLs and urgency tactics."
        elif final_probability > 30:
            explanation = "Medium risk: Some suspicious elements detected, such as external links and urgent language."

        return final_probability, list(set(flagged)), explanation

class AnomalyDetector:
    def __init__(self):
        self._model = None
        self._initialized = False

    def _ensure_initialized(self):
        if self._initialized:
            return

        global IsolationForest, np
        try:
            if np is None:
                import numpy as np
            if IsolationForest is None:
                from sklearn.ensemble import IsolationForest
                
            # Initialize model
            self._model = IsolationForest(contamination=0.1, random_state=42)
            # Pre-train with some dummy data to avoid errors if first call is too small
            dummy_data = np.random.rand(10, 4) # source_port, dest_port, packet_count, protocol_encoded
            self._model.fit(dummy_data)
        except ImportError:
            self._model = None
        except Exception:
            self._model = None
            
        self._initialized = True

    def analyze(self, source_port: int, dest_port: int, packet_count: int, protocol: str) -> Tuple[float, str, str]:
        self._ensure_initialized()
        
        # Simple encoding for protocol
        proto_map = {"TCP": 1, "UDP": 2, "ICMP": 3, "HTTP": 4, "HTTPS": 5}
        proto_val = proto_map.get(protocol.upper(), 0)

        anomaly_score = 0.0
        
        if self._model and np:
            try:
                # Features for detection
                features = np.array([[source_port, dest_port, packet_count, proto_val]])
                
                # Isolation Forest returns -1 for anomalies
                prediction = self._model.decision_function(features)[0]
                
                # Normalize prediction to 0-100 score
                # decision_function output is roughly [-0.5, 0.5]
                # We want higher score for higher anomaly
                anomaly_score = (1 - (prediction + 0.5)) * 100
                anomaly_score = max(0, min(100, anomaly_score))
            except Exception:
                # Fallbck logic below
                pass
        
        # Fallback heuristic if model failed or not loaded
        if anomaly_score == 0.0:
             if packet_count > 1000:
                 anomaly_score = 75.0
             elif dest_port == 23 or dest_port == 22: # Telnet/SSH brute force check basic
                 if packet_count > 100:
                    anomaly_score = 60.0

        risk_level = "low"
        description = "Network activity appears normal."

        if anomaly_score > 80:
            risk_level = "high"
            description = f"Critical anomaly detected: Unusual activity on port {dest_port} with high packet count ({packet_count}). Possible DDoS or Port Scanning."
        elif anomaly_score > 50:
            risk_level = "medium"
            description = "Moderate deviation from normal traffic patterns detected."

        return anomaly_score, risk_level, description

# Singleton instances (global scope init is fast now)
phishing_engine = PhishingDetector()
anomaly_engine = AnomalyDetector()
