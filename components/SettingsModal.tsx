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
  const [apiKey, setApiKey] = useState<string>(initialApiKey || '');
  const [model, setModel] = useState<string>(initialModel || 'gemini-2.5-flash');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(initialDemoMode || false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(initialApiKey || '');
      setModel(initialModel || 'gemini-2.5-flash');
      setIsDemoMode(initialDemoMode);
    }
  }, [isOpen, initialApiKey, initialModel, initialDemoMode]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ apiKey, model, isDemoMode });
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
          <p>To use real AI features (resume polishing and tailored keyword suggestions), enter your Google Gemini API Key. The key is stored safely in your browser's local storage and is never uploaded elsewhere.</p>
          
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="modal-api-key">Gemini API Key</label>
            <input 
              type="password" 
              id="modal-api-key"
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={isDemoMode ? "Demo Mode Active - Key Optional" : "AIzaSy..."}
              disabled={isDemoMode}
            />
            <div className="helper-text">
              Don't have a key? Get a free one from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.
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
