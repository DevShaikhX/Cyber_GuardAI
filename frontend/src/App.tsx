import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  Mail, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  History, 
  LayoutDashboard,
  ShieldAlert,
  Zap
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
import RansomwareForm from './components/RansomwareForm';
import DDoSForm from './components/DDoSForm';
import AuditLog from './components/AuditLog';
import { EmailData, NetworkData, HistoryItem, Prediction, RansomwareData, DdosData } from './types';

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
  const [ransomwareData, setRansomwareData] = useState<RansomwareData>({
    process_name: '',
    file_path: '/sys/bin/',
    file_hash: '',
    suspicious_activity: ''
  });
  const [ddosData, setDdosData] = useState<DdosData>({
    target_ip: '',
    traffic_volume: 0,
    protocol: 'UDP',
    attack_type: 'Flood'
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
      // console.error("Failed to fetch history", err);
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

  const submitRansomware = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/submit-ransomware', ransomwareData);
      setLastResult(res.data);
      fetchHistory();
    } catch (err) {
      alert("Error submitting ransomware analysis");
    } finally {
      setLoading(false);
    }
  };

  const submitDdos = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/submit-ddos', ddosData);
      setLastResult(res.data);
      fetchHistory();
    } catch (err) {
      alert("Error submitting DDoS analysis");
    } finally {
      setLoading(false);
    }
  };

  const renderReport = () => {
    if (!lastResult) return null;
    const isDanger = (lastResult.phishing_probability ?? 0) > 50 || (lastResult.anomaly_score ?? 0) > 50 || (lastResult.risk_level === 'high');
    
    return (
      <div className="glass-card animate-fade stagger-3" style={{ borderLeft: `4px solid ${isDanger ? 'var(--danger)' : 'var(--success)'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="var(--accent-primary)" />
              Threat Intelligence Report
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Confidence Score</span>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Outfit', color: isDanger ? 'var(--danger)' : 'var(--success)' }}>
                {lastResult.phishing_probability ?? lastResult.anomaly_score ?? (lastResult.risk_level === 'high' ? 95 : 15)}%
              </p>
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-secondary)', maxWidth: '800px' }}>
              {lastResult.explanation || lastResult.suspicious_activity_description}
            </p>
            {lastResult.flagged_sections && lastResult.flagged_sections.length > 0 && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <p style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} color="var(--warning)" />
                  Detected Indicators
                </p>
                <ul className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', listStyle: 'none' }}>
                  {lastResult.flagged_sections.map((s, i) => (
                    <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(244, 63, 94, 0.05)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div style={{ 
            padding: '24px', 
            borderRadius: '20px', 
            background: isDanger ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          }}>
            { isDanger ? <AlertTriangle size={48} color="var(--danger)" /> : <Shield size={48} color="var(--success)" /> }
          </div>
        </div>
      </div>
    );
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingLeft: '0.75rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Shield size={24} color="white" />
          </div>
          <h2 className="brand-text" style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CyberGuard</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('dashboard'); closeMenu(); }}
          >
            <LayoutDashboard size={20} /> <span style={{ marginTop: '2px' }}>Dashboard</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'analyze' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('analyze'); closeMenu(); }}
          >
            <Shield size={20} /> <span style={{ marginTop: '2px' }}>Analyze Threats</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'ransomware' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('ransomware'); closeMenu(); }}
          >
            <ShieldAlert size={20} /> <span style={{ marginTop: '2px' }}>Ransomware</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'ddos' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('ddos'); closeMenu(); }}
          >
            <Zap size={20} /> <span style={{ marginTop: '2px' }}>DDoS</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('history'); closeMenu(); }}
          >
            <History size={20} /> <span style={{ marginTop: '2px' }}>Audit Log</span>
          </button>
        </nav>

        <div style={{ marginTop: 'auto', opacity: 0.4, fontSize: '0.75rem', paddingLeft: '0.75rem' }}>
          <p>© 2026 CyberGuard AI</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span>
            System: Optimal
          </p>
        </div>
      </div>

      <main className="main-content">
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="animate-fade">
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Enterprise-grade AI threat intelligence</p>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-fade stagger-2">
            <Dashboard history={history} />
            <div style={{ marginTop: '2rem' }}>
              <AuditLog history={history.slice(0, 5)} />
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="grid animate-fade stagger-2">
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
            {/* Report component used in multiple tabs */}
            <div style={{ gridColumn: 'span 2' }}>{renderReport()}</div>
          </div>
        )}

        {activeTab === 'ransomware' && (
          <div className="grid animate-fade stagger-2">
            <RansomwareForm 
              ransomwareData={ransomwareData} 
              setRansomwareData={setRansomwareData} 
              onSubmit={submitRansomware} 
              loading={loading} 
            />
            <div style={{ gridColumn: 'span 2' }}>{renderReport()}</div>
          </div>
        )}

        {activeTab === 'ddos' && (
          <div className="grid animate-fade stagger-2">
            <DDoSForm 
              ddosData={ddosData} 
              setDdosData={setDdosData} 
              onSubmit={submitDdos} 
              loading={loading} 
            />
            <div style={{ gridColumn: 'span 2' }}>{renderReport()}</div>
          </div>
        )}

        {activeTab === 'history' && <div className="animate-fade stagger-2"><AuditLog history={history} /></div>}
      </main>
    </div>
  );
};

export default App;
