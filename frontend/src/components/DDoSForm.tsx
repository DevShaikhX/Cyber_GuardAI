import React from 'react';
import { Zap, Globe, Gauge } from 'lucide-react';

interface DDoSFormProps {
  ddosData: {
    target_ip: string;
    traffic_volume: number;
    protocol: string;
    attack_type: string;
  };
  setDdosData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const DDoSForm: React.FC<DDoSFormProps> = ({ ddosData, setDdosData, onSubmit, loading }) => {
  return (
    <div className="glass-card stagger-1">
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px' }}>
          <Zap size={20} color="#8b5cf6" />
        </div>
        DDoS Attack Detection
      </h3>
      <form onSubmit={onSubmit}>
        <div style={{ position: 'relative' }}>
          <Globe size={18} style={{ position: 'absolute', left: '12px', top: '14px', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="Target IP Address" 
            className="input-field" 
            style={{ paddingLeft: '40px' }}
            value={ddosData.target_ip}
            onChange={(e) => setDdosData({...ddosData, target_ip: e.target.value})}
            required
          />
        </div>
        <div style={{ position: 'relative' }}>
          <Gauge size={18} style={{ position: 'absolute', left: '12px', top: '14px', opacity: 0.5 }} />
          <input 
            type="number" 
            placeholder="Traffic Volume (Requests per/sec)" 
            className="input-field" 
            style={{ paddingLeft: '40px' }}
            value={ddosData.traffic_volume}
            onChange={(e) => setDdosData({...ddosData, traffic_volume: parseInt(e.target.value)})}
            required
          />
        </div>
        <select 
          className="input-field" 
          value={ddosData.protocol}
          onChange={(e) => setDdosData({...ddosData, protocol: e.target.value})}
          required
        >
          <option value="UDP">UDP Flood</option>
          <option value="TCP">TCP SYN Flood</option>
          <option value="HTTP">HTTP GET/POST Flood</option>
          <option value="ICMP">ICMP Ping Flood</option>
        </select>
        <select 
          className="input-field" 
          value={ddosData.attack_type}
          onChange={(e) => setDdosData({...ddosData, attack_type: e.target.value})}
          required
        >
          <option value="Flood">Flood Attack</option>
          <option value="Amplification">Amplification Attack</option>
          <option value="Volumetric">Volumetric Attack</option>
          <option value="Application">Application Layer Attack</option>
        </select>
        <button type="submit" className="btn btn-primary" style={{ border: '1px solid #8b5cf6', background: 'rgba(139, 92, 246, 0.1)', width: '100%' }} disabled={loading}>
          {loading ? 'Analyzing Traffic...' : 'Monitor Traffic Stream'}
        </button>
      </form>
    </div>
  );
};

export default DDoSForm;
