import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  Mail, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  History, 
  LayoutDashboard
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Import Modular Components
import Dashboard from './components/Dashboard';
import EmailForm from './components/EmailForm';
import NetworkForm from './components/NetworkForm';
import AuditLog from './components/AuditLog';
import { EmailData, NetworkData, HistoryItem, Prediction } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  // ... rest of state stays the same
  const [emailData, setEmailData] = useState<EmailData>({ 
    sender_email: '', 
    recipient_email: '', 
    subject: '', 
    body: '', 
    urls: [] 
  });
  const [networkData, setNetworkData] = useState<NetworkData>({
    source_ip: '',
    destination_ip: '',
    source_port: 0,
    destination_port: 0,
    protocol: 'TCP',
    packet_count: 0
  });
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<Prediction | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  // ... fetchHistory, submitEmail, submitNetwork stay the same
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/get-results');
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/submit-email', {
        ...emailData,
        urls: emailData.urls.length ? emailData.urls : []
      });
      setLastResult(res.data);
      fetchHistory();
    } catch (err) {
      alert("Error submitting email analysis");
    } finally {
      setLoading(false);
    }
  };

  const submitNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/submit-network-log', networkData);
      setLastResult(res.data);
      fetchHistory();
    } catch (err) {
      alert("Error submitting network analysis");
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={24} color="var(--accent-primary)" />
          <h3 style={{ margin: 0 }}>CyberGuard</h3>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <Activity size={24} /> : <LayoutDashboard size={24} />}
        </button>
      </header>

      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={32} color="var(--accent-primary)" />
          <h2 style={{ margin: 0 }}>CyberGuard</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => { setActiveTab('dashboard'); closeMenu(); }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            className={`btn ${activeTab === 'analyze' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => { setActiveTab('analyze'); closeMenu(); }}
          >
            <Shield size={18} /> Analyze Threats
          </button>
          <button 
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => { setActiveTab('history'); closeMenu(); }}
          >
            <History size={18} /> Audit Log
          </button>
        </nav>

        <div style={{ marginTop: 'auto', opacity: 0.5, fontSize: '0.75rem' }}>
          <p>© 2026 CyberGuard AI</p>
          <p>System Status: Optimal</p>
        </div>
      </div>

      <main className="main-content">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>AI-Powered Cybersecurity Monitoring</p>
          </div>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={16} color="var(--accent-secondary)" />
            <span style={{ fontSize: '0.875rem' }}>Models Loaded</span>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <Dashboard history={history} />
            <AuditLog history={history.slice(0, 5)} />
          </>
        )}

        {activeTab === 'analyze' && (
          <div className="grid animate-fade">
            <EmailForm 
              emailData={emailData} 
              setEmailData={setEmailData} 
              onSubmit={submitEmail} 
              loading={loading} 
            />
            <NetworkForm 
              networkData={networkData} 
              setNetworkData={setNetworkData} 
              onSubmit={submitNetwork} 
              loading={loading} 
            />
            
            {lastResult && (
              <div className="glass-card" style={{ gridColumn: 'span 2', border: `1px solid ${ ((lastResult.phishing_probability ?? 0) > 50 || (lastResult.anomaly_score ?? 0) > 50) ? 'var(--danger)' : 'var(--accent-secondary)'}` }}>
                <h3>Analysis Result</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      Score: {lastResult.phishing_probability ?? lastResult.anomaly_score ?? 0}%
                    </p>
                    <p style={{ opacity: 0.8 }}>{lastResult.explanation || lastResult.suspicious_activity_description}</p>
                    {lastResult.flagged_sections && lastResult.flagged_sections.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontWeight: 'bold' }}>Flagged Evidence:</p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                          {lastResult.flagged_sections.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                  { ((lastResult.phishing_probability ?? 0) > 50 || (lastResult.anomaly_score ?? 0) > 50) ? <AlertTriangle size={64} color="var(--danger)" /> : <CheckCircle size={64} color="var(--accent-secondary)" /> }
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && <AuditLog history={history} />}
      </main>
    </div>
  );
};

export default App;
