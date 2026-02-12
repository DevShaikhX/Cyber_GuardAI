import React from 'react';
import { HistoryItem } from '../types';

interface AuditLogProps {
  history: HistoryItem[];
}

const AuditLog: React.FC<AuditLogProps> = ({ history }) => {
  return (
    <div className="glass-card animate-fade">
      <h3>Detection History</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
            <th style={{ padding: '1rem' }}>Type</th>
            <th>Details</th>
            <th>Score</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>{h.type.toUpperCase()}</td>
              <td style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                {h.type === 'email' ? h.input_data.sender_email : `${h.input_data.source_ip} -> ${h.input_data.destination_ip}`}
              </td>
              <td>{(h.prediction.phishing_probability ?? h.prediction.anomaly_score) ?? 'N/A'}%</td>
              <td>
                <span className={`risk-tag risk-${h.prediction.risk_level || ( (h.prediction.phishing_probability ?? 0) > 70 ? 'high' : 'medium')}`}>
                  {h.prediction.risk_level || ( (h.prediction.phishing_probability ?? 0) > 70 ? 'High' : 'Safe')}
                </span>
              </td>
              <td style={{ fontSize: '0.75rem' }}>{new Date(h.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLog;
