import React from 'react';
import { Mail } from 'lucide-react';
import { EmailData } from '../types';

interface EmailFormProps {
  emailData: EmailData;
  setEmailData: (data: EmailData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const EmailForm: React.FC<EmailFormProps> = ({ emailData, setEmailData, onSubmit, loading }) => {
  return (
    <div className="glass-card animate-fade stagger-1">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
          <Mail size={20} color="var(--accent-primary)" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Phishing Analysis</h2>
      </div>
      <form onSubmit={onSubmit}>
        <input 
          className="input-field" 
          placeholder="Sender Email" 
          value={emailData.sender_email}
          onChange={e => setEmailData({...emailData, sender_email: e.target.value})}
          required
        />
        <input 
          className="input-field" 
          placeholder="Recipient Email" 
          value={emailData.recipient_email}
          onChange={e => setEmailData({...emailData, recipient_email: e.target.value})}
          required
        />
        <input 
          className="input-field" 
          placeholder="Subject" 
          value={emailData.subject}
          onChange={e => setEmailData({...emailData, subject: e.target.value})}
          required
        />
        <textarea 
          className="input-field" 
          rows={4} 
          placeholder="Email Body Content"
          value={emailData.body}
          onChange={e => setEmailData({...emailData, body: e.target.value})}
          required
        />
        <input 
          className="input-field" 
          placeholder="URLs (comma separated)"
          value={emailData.urls.join(', ')}
          onChange={e => setEmailData({...emailData, urls: e.target.value.split(',').map(u => u.trim())})}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Scan Email'}
        </button>
      </form>
    </div>
  );
};

export default EmailForm;
