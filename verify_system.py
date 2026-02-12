import requests
import json
import time

BASE_URL = "http://localhost:8001"

def test_health():
    try:
        res = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {res.json()}")
        return True
    except:
        print("Backend not running yet.")
        return False

def test_email_phishing():
    print("\nTesting Email Phishing Detection...")
    payload = {
        "sender_email": "security@alert-verify.net",
        "recipient_email": "user@example.com",
        "subject": "URGENT: Account Suspension",
        "body": "Your account has been suspended. Please click the link to verify your identity immediately.",
        "urls": ["http://secure-login-verify.net/update"]
    }
    res = requests.post(f"{BASE_URL}/submit-email", json=payload)
    print(json.dumps(res.json(), indent=2))

def test_network_anomaly():
    print("\nTesting Network Anomaly Detection...")
    payload = {
        "source_ip": "192.168.1.50",
        "destination_ip": "10.0.0.1",
        "source_port": 443,
        "destination_port": 22,
        "protocol": "TCP",
        "packet_count": 5000
    }
    res = requests.post(f"{BASE_URL}/submit-network-log", json=payload)
    print(json.dumps(res.json(), indent=2))

def test_get_results():
    print("\nFetching Audit Logs...")
    res = requests.get(f"{BASE_URL}/get-results")
    print(f"Total results in history: {len(res.json())}")

if __name__ == "__main__":
    # Note: In a real environment, we'd start the server in a separate process
    # For this verification, we assume the server is running or we just test the logic
    print("Verification Script Started")
    if test_health():
        test_email_phishing()
        test_network_anomaly()
        test_get_results()
