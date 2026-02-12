import React from 'react';
import { HistoryItem } from '../types';

interface AuditLogProps {
  history: HistoryItem[];
}

const AuditLog: React.FC<AuditLogProps> = ({ history }) => {
  return (
    <div className="glass-card animate-fade">
      <h3>Detection History</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', minWidth: '700px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem', width: '100px' }}>Type</th>
              <th style={{ padding: '1rem' }}>Details</th>
              <th style={{ padding: '1rem', width: '120px' }}>Score</th>
              <th style={{ padding: '1rem', width: '120px' }}>Status</th>
              <th style={{ padding: '1rem', width: '180px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => {
              const score = (h.prediction.phishing_probability ?? h.prediction.anomaly_score);
              const formattedScore = typeof score === 'number' ? score.toFixed(2) : 'N/A';
              
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{h.type.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
                    {h.type === 'email' ? h.input_data.sender_email : `${h.input_data.source_ip} -> ${h.input_data.destination_ip}`}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{formattedScore}%</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`risk-tag risk-${h.prediction.risk_level || ( (h.prediction.phishing_probability ?? 0) > 70 ? 'high' : 'medium')}`}>
                      {h.prediction.risk_level || ( (h.prediction.phishing_probability ?? 0) > 70 ? 'High' : 'Safe')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(h.timestamp).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
