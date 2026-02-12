import React from 'react';
import { Mail, Activity } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { HistoryItem } from '../types';

interface DashboardProps {
  history: HistoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const safeCount = history.filter(h => (h.prediction.phishing_probability !== undefined && h.prediction.phishing_probability < 30) || (h.prediction.anomaly_score !== undefined && h.prediction.anomaly_score < 50)).length;
  const phishingCount = history.filter(h => h.type === 'email' && h.prediction.phishing_probability !== undefined && h.prediction.phishing_probability >= 30).length;
  const anomalyCount = history.filter(h => h.type === 'network' && h.prediction.anomaly_score !== undefined && h.prediction.anomaly_score >= 50).length;

  return (
    <div className="animate-fade">
      <div className="grid">
        <div className="glass-card">
          <h3>Threat Overview</h3>
          <div style={{ height: '200px' }}>
            <Doughnut 
              data={{
                labels: ['Safe', 'Phishing', 'Anomalous'],
                datasets: [{
                  data: [safeCount, phishingCount, anomalyCount],
                  backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                  borderWidth: 0
                }]
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="glass-card">
          <h3>Recent Alerts</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {history.slice(0, 5).map((h, i) => (
              <div key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {h.type === 'email' ? <Mail size={16} /> : <Activity size={16} />}
                <span style={{ fontSize: '0.875rem' }}>{h.type === 'email' ? h.input_data.subject : `IP: ${h.input_data.source_ip}`}</span>
                <span className={`risk-tag risk-${h.prediction.risk_level || ( (h.prediction.phishing_probability ?? 0) > 70 ? 'high' : 'low')}`}>
                  {h.prediction.risk_level || 'Detect'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
