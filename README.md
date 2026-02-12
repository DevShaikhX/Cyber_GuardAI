# CyberGuard AI

CyberGuard AI is a comprehensive, AI-powered cybersecurity monitoring platform designed to detect phishing attempts in emails and anomalies in network traffic. It combines modern web technologies with machine learning models to provide real-time threat intelligence.

## 🚀 Key Features

- **AI-Powered Phishing Detection**:
  - Utilizes transformer models (via Hugging Face) for semantic analysis.
  - Heuristic-based checks for suspicious URLs, sender domains, and urgent language.
- **Network Anomaly Detection**:
  - Employs the **Isolation Forest** algorithm to identify deviant traffic patterns.
  - Analyzes port usage, protocol types, and packet counts.
- **Real-Time Monitoring Dashboard**:
  - Interactive UI with live data visualization using Chart.js.
  - Audit logs for historical threat tracking.
- **Robust API Layer**:
  - Built with FastAPI for high performance and automatic documentation.

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Chart.js** (Data Visualization)
- **Lucide React** (Iconography)
- **Vanilla CSS** (Custom Styling)

### Backend
- **Python 3.8+**
- **FastAPI** (Web Framework)
- **SQLAlchemy** (ORM)
- **Transformers** & **Torch** (AI/ML)
- **Scikit-learn** (Anomaly Detection)
- **SQLite** (Database)

## 🏁 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.8+)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```
The API will be available at `http://localhost:8000`. You can access the auto-generated documentation at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
The application will be accessible at `http://localhost:3000`.

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/submit-email` | `POST` | Analyze email content for phishing signals. |
| `/submit-network-log` | `POST` | Check network traffic for anomalies. |
| `/get-results` | `GET` | Retrieve history of detection results. |
| `/health` | `GET` | Check system status. |

## 📁 Project Structure

```text
├── backend/            # FastAPI source code & ML engines
├── frontend/           # React dashboard & UI components
├── cyberguard.db       # SQLite database
└── README.md           # Project documentation
```

## ⚖️ License
MIT License
"# Cyber_GuardAI" 
"# Cyber" 
