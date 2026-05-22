import React from 'react';
import { Sparkles, Sun, Moon, KeyRound, Trash2 } from 'lucide-react';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  openSettings: () => void;
  isDemoMode: boolean;
  onLogoClick: () => void;
  onClearData: () => void;
}

export default function Header({
  theme,
  toggleTheme,
  openSettings,
  isDemoMode,
  onLogoClick,
  onClearData,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="logo" onClick={onLogoClick} style={{ cursor: 'pointer' }} title="Go to home">
        <Sparkles className="logo-icon" size={24} />
        <span>SmartPath <span className="logo-highlight">AI</span></span>
      </div>
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isDemoMode && (
          <span className="badge warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }}></span>
            Demo Mode
          </span>
        )}
        <button onClick={onClearData} className="btn btn-secondary btn-sm font-sm" style={{ gap: '0.25rem' }} title="Reset and Clear CV Data">
          <Trash2 size={14} /> Clear Data
        </button>
       
        <button onClick={toggleTheme} className="icon-btn" title="Toggle Theme" aria-label="Toggle dark/light theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
