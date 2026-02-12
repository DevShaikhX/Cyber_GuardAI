import { HistoryItem } from '../types';
import { Mail, Activity, ShieldAlert, Zap } from 'lucide-react';

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        padding: '6px', 
                        borderRadius: '6px', 
                        background: h.type === 'email' ? 'rgba(99, 102, 241, 0.1)' : 
                                   h.type === 'network' ? 'rgba(139, 92, 246, 0.1)' :
                                   h.type === 'ransomware' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(139, 92, 246, 0.1)'
                      }}>
                        {h.type === 'email' ? <Mail size={14} color="var(--accent-primary)" /> : 
                         h.type === 'network' ? <Activity size={14} color="var(--accent-secondary)" /> :
                         h.type === 'ransomware' ? <ShieldAlert size={14} color="#ec4899" /> : <Zap size={14} color="#8b5cf6" />}
                      </div>
                      <span style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{h.type.toUpperCase()}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
                    {h.type === 'email' ? h.input_data.sender_email : 
                     h.type === 'network' ? `${h.input_data.source_ip} -> ${h.input_data.destination_ip}` :
                     h.type === 'ransomware' ? h.input_data.process_name : h.input_data.target_ip}
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
