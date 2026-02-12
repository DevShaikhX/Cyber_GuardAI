import React from 'react';
import { ShieldAlert, Terminal, FileWarning } from 'lucide-react';

interface RansomwareFormProps {
  ransomwareData: {
    process_name: string;
    file_path: string;
    file_hash: string;
    suspicious_activity: string;
  };
  setRansomwareData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const RansomwareForm: React.FC<RansomwareFormProps> = ({ ransomwareData, setRansomwareData, onSubmit, loading }) => {
  return (
    <div className="glass-card stagger-1">
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ padding: '8px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '10px' }}>
          <ShieldAlert size={20} color="#ec4899" />
        </div>
        Ransomware Analysis
      </h3>
      <form onSubmit={onSubmit}>
        <div style={{ position: 'relative' }}>
          <Terminal size={18} style={{ position: 'absolute', left: '12px', top: '14px', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="Process Name (e.g., svchost.exe)" 
            className="input-field" 
            style={{ paddingLeft: '40px' }}
            value={ransomwareData.process_name}
            onChange={(e) => setRansomwareData({...ransomwareData, process_name: e.target.value})}
            required
          />
        </div>
        <div style={{ position: 'relative' }}>
          <FileWarning size={18} style={{ position: 'absolute', left: '12px', top: '14px', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="File Hash (MD5/SHA256)" 
            className="input-field" 
            style={{ paddingLeft: '40px' }}
            value={ransomwareData.file_hash}
            onChange={(e) => setRansomwareData({...ransomwareData, file_hash: e.target.value})}
            required
          />
        </div>
        <textarea 
          placeholder="Suspicious Behavior (e.g., unusual file encryption, rapid I/O)" 
          className="input-field" 
          style={{ minHeight: '120px' }}
          value={ransomwareData.suspicious_activity}
          onChange={(e) => setRansomwareData({...ransomwareData, suspicious_activity: e.target.value})}
          required
        ></textarea>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Analyzing Behavior...' : 'Initialize Analysis'}
        </button>
      </form>
    </div>
  );
};

export default RansomwareForm;
