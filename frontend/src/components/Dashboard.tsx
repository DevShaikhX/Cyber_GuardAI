import React from 'react';
import { Mail, Activity, ShieldAlert, Zap } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { HistoryItem } from '../types';

interface DashboardProps {
  history: HistoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const phishingCount = history.filter(h => h.type === 'email' && (h.prediction.phishing_probability ?? 0) >= 30).length;
  const anomalyCount = history.filter(h => h.type === 'network' && (h.prediction.anomaly_score ?? 0) >= 50).length;
  const ransomwareCount = history.filter(h => h.type === 'ransomware').length;
  const ddosCount = history.filter(h => h.type === 'ddos').length; 
  const totalThreats = phishingCount + anomalyCount + ransomwareCount + ddosCount;
  const safeCount = Math.max(0, history.length - totalThreats);

  const chartColors = {
    safe: '#10b981',
    phishing: '#f43f5e',
    anomaly: '#f59e0b',
    ransomware: '#ec4899', // Pink
    ddos: '#8b5cf6'        // Violet/Purple
  };

  return (
    <div className="animate-fade stagger-2">
      <div className="grid">
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'rgba(99, 102, 241, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.1)'
          }} className="pulse-slow">
            <Activity size={24} color="var(--accent-primary)" />
          </div>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 700 }}>Security Posture</h3>
          <div style={{ height: '260px', position: 'relative' }}>
            <Doughnut 
              data={{
                labels: ['Safe', 'Phishing', 'Anomalous', 'Ransomware', 'DDoS'],
                datasets: [{
                  data: [safeCount === 0 && history.length === 0 ? 1 : safeCount, phishingCount, anomalyCount, ransomwareCount, ddosCount],
                  backgroundColor: [chartColors.safe, chartColors.phishing, chartColors.anomaly, chartColors.ransomware, chartColors.ddos],
                  hoverOffset: 25,
                  borderRadius: 8,
                  spacing: 4,
                  borderWidth: 0
                }]
              }}
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#94a3b8',
                      font: { family: 'Outfit', size: 14, weight: 500 },
                      padding: 30,
                      usePointStyle: true,
                      pointStyle: 'rectRounded'
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(15, 17, 26, 0.9)',
                    titleFont: { family: 'Outfit' },
                    bodyFont: { family: 'Inter' },
                    padding: 12,
                    cornerRadius: 10,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                  }
                },
                cutout: '75%'
              }}
            />
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'grid', 
              placeItems: 'center', 
              pointerEvents: 'none'
            }}>
              {/* Center metrics removed as requested */}
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'rgba(139, 92, 246, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1.5rem',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.1)'
          }} className="pulse-slow">
            <Mail size={24} color="var(--accent-secondary)" />
          </div>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 700 }}>Neural Feed</h3>
          <div style={{ maxHeight: '260px', overflowY: 'auto', paddingRight: '12px' }}>
            {history.length > 0 ? history.slice(0, 6).map((h, i) => (
              <div key={i} style={{ 
                padding: '1.25rem', 
                marginBottom: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '1rem',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }} className="hover-lift">
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div style={{ 
                    padding: '8px', 
                    borderRadius: '8px', 
                    background: h.type === 'email' ? 'rgba(99, 102, 241, 0.1)' : 
                               h.type === 'network' ? 'rgba(139, 92, 246, 0.1)' :
                               h.type === 'ransomware' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(139, 92, 246, 0.1)'
                  }}>
                    {h.type === 'email' ? <Mail size={16} color="var(--accent-primary)" /> : 
                     h.type === 'network' ? <Activity size={16} color="var(--accent-secondary)" /> :
                     h.type === 'ransomware' ? <ShieldAlert size={16} color="#ec4899" /> : <Zap size={16} color="#8b5cf6" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.875rem', display: 'block', fontWeight: 500 }}>
                      {h.type === 'email' ? (h.input_data.subject.length > 25 ? h.input_data.subject.substring(0, 25) + '...' : h.input_data.subject) : 
                       h.type === 'network' ? `Probe: ${h.input_data.source_ip}` :
                       h.type === 'ransomware' ? `PID: ${h.input_data.process_name}` : `Target: ${h.input_data.target_ip}`}
                    </span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{new Date(h.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                <span className={`risk-tag risk-${h.prediction.risk_level || ( (h.prediction.phishing_probability ?? 0) > 70 ? 'high' : 'low')}`}>
                  {h.prediction.risk_level || 'Detect'}
                </span>
              </div>
            )) : (
              <p style={{ opacity: 0.5, textAlign: 'center', marginTop: '3rem' }}>No activity monitored</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
