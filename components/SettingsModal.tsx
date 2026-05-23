import React, { useState, useEffect } from 'react';
import { KeyRound, X } from 'lucide-react';
import { Settings } from '../lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialApiKey: string;
  initialModel: string;
  initialDemoMode: boolean;
  onSave: (settings: Settings) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  initialApiKey,
  initialModel,
  initialDemoMode,
  onSave,
}: SettingsModalProps) {
  const [model, setModel] = useState<string>(initialModel || 'gemini-2.5-flash');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(initialDemoMode || false);

  useEffect(() => {
    if (isOpen) {
      setModel(initialModel || 'gemini-2.5-flash');
      setIsDemoMode(initialDemoMode);
    }
  }, [isOpen, initialModel, initialDemoMode]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ apiKey: '', model, isDemoMode });
    onClose();
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <KeyRound size={20} className="logo-icon" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            <span>API Settings</span>
          </h3>
          <button onClick={onClose} className="close-btn" aria-label="Close settings">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p>This website is powered by a secure, preconfigured Gemini AI model. Real AI features (resume polishing, professional summaries, and job tailoring) are fully active and available for you to use.</p>
          
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>API Key Status</label>
            <div className="helper-text" style={{ fontSize: '0.95rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
              Secure Preconfigured Key Active (Unlimited Use)
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="modal-model-select">Gemini Model</label>
            <select 
              id="modal-model-select"
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              disabled={isDemoMode}
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Super Fast)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
            </select>
          </div>

          <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="modal-demo-checkbox" 
              checked={isDemoMode} 
              onChange={(e) => setIsDemoMode(e.target.checked)}
            />
            <label htmlFor="modal-demo-checkbox" style={{ cursor: 'pointer' }}>Use Demo Mode (Mock AI responses without API key)</label>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave} className="btn btn-primary">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
