import React from 'react';
import { Activity } from 'lucide-react';
import { NetworkData } from '../types';

interface NetworkFormProps {
  networkData: NetworkData;
  setNetworkData: (data: NetworkData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const NetworkForm: React.FC<NetworkFormProps> = ({ networkData, setNetworkData, onSubmit, loading }) => {
  return (
    <div className="glass-card animate-fade stagger-1">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
          <Activity size={20} color="var(--accent-secondary)" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Traffic Profiling</h2>
      </div>
      <form onSubmit={onSubmit}>
        <input 
          className="input-field" 
          placeholder="Source IP" 
          value={networkData.source_ip}
          onChange={e => setNetworkData({...networkData, source_ip: e.target.value})}
          required
        />
        <input 
          className="input-field" 
          placeholder="Destination IP" 
          value={networkData.destination_ip}
          onChange={e => setNetworkData({...networkData, destination_ip: e.target.value})}
          required
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            className="input-field" 
            type="number" 
            placeholder="S-Port" 
            value={networkData.source_port || ''}
            onChange={e => setNetworkData({...networkData, source_port: parseInt(e.target.value) || 0})}
            required
          />
          <input 
            className="input-field" 
            type="number" 
            placeholder="D-Port" 
            value={networkData.destination_port || ''}
            onChange={e => setNetworkData({...networkData, destination_port: parseInt(e.target.value) || 0})}
            required
          />
        </div>
        <select 
          className="input-field" 
          value={networkData.protocol}
          onChange={e => setNetworkData({...networkData, protocol: e.target.value})}
        >
          <option>TCP</option>
          <option>UDP</option>
          <option>ICMP</option>
          <option>HTTP</option>
          <option>HTTPS</option>
        </select>
        <input 
          className="input-field" 
          type="number" 
          placeholder="Packet Count" 
          value={networkData.packet_count || ''}
          onChange={e => setNetworkData({...networkData, packet_count: parseInt(e.target.value) || 0})}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Scan Traffic'}
        </button>
      </form>
    </div>
  );
};

export default NetworkForm;
