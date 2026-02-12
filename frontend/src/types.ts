export interface EmailData {
    sender_email: string;
    recipient_email: string;
    subject: string;
    body: string;
    urls: string[];
}

export interface NetworkData {
    source_ip: string;
    destination_ip: string;
    source_port: number;
    destination_port: number;
    protocol: string;
    packet_count: number;
}

export interface Prediction {
    phishing_probability?: number;
    anomaly_score?: number;
    risk_level?: 'low' | 'medium' | 'high';
    explanation?: string;
    suspicious_activity_description?: string;
    flagged_sections?: string[];
}

export interface HistoryItem {
    type: 'email' | 'network';
    input_data: any; // Can be EmailData or NetworkData
    prediction: Prediction;
    timestamp: string;
}

export interface SubmissionResponse extends Prediction {
    // Any additional fields if needed
}
