'use client';

import React, { useState, useEffect } from 'react';
import { FileText, CheckSquare, Printer, Check } from 'lucide-react';
import Header from '../components/Header';
import FormWizard from '../components/FormWizard';
import ResumePreview from '../components/ResumePreview';
import ATSAnalysis from '../components/ATSAnalysis';
import SettingsModal from '../components/SettingsModal';
import LandingPage from '../components/LandingPage';
import { improveSummary, improveBulletPoint, tailorResume } from '../lib/gemini';
import { CVData, Toast, Settings } from '../lib/types';

const EMPTY_CV: CVData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: []
  },
  projects: [],
  certs: [],
  jobDescription: ''
};

export default function Home() {
  const [cvData, setCvData] = useState<CVData>(EMPTY_CV);
  const [theme, setTheme] = useState<string>('dark');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('preview');
  const [view, setView] = useState<string>('landing');
  
  // Settings States
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDC4aetJ9bzRdsY_FFdw6-IsWSYYek9tgI');
  const [model, setModel] = useState<string>('gemini-2.5-flash');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  
  // Feedbacks
  const [tailorFeedback, setTailorFeedback] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCv = localStorage.getItem('ats_cv_data');
      if (savedCv) {
        try {
          setCvData(JSON.parse(savedCv));
        } catch (e) {
          console.error('Error parsing CV from localStorage', e);
        }
      }
      
      const savedTheme = localStorage.getItem('ats_theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);

      const savedApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDC4aetJ9bzRdsY_FFdw6-IsWSYYek9tgI';
      setApiKey(savedApiKey);
      localStorage.setItem('ats_api_key', savedApiKey);

      const savedModel = localStorage.getItem('ats_model') || 'gemini-2.5-flash';
      setModel(savedModel);

      const savedDemo = localStorage.getItem('ats_demo_mode');
      setIsDemoMode(savedDemo !== null ? JSON.parse(savedDemo) : false);
    }
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (cvData !== EMPTY_CV) {
      localStorage.setItem('ats_cv_data', JSON.stringify(cvData));
    }
  }, [cvData]);

  // Manage document title during printing to completely eliminate default browser headers/footers
  useEffect(() => {
    const handleBeforePrint = () => {
      // Store original title
      (window as any)._originalTitle = document.title;
      // Set title to single space to keep printed page header completely empty
      document.title = " ";
    };

    const handleAfterPrint = () => {
      if ((window as any)._originalTitle) {
        document.title = (window as any)._originalTitle;
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Toast helper
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('ats_theme', nextTheme);
  };

  const handleSaveSettings = (settings: Settings) => {
    const activeKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDC4aetJ9bzRdsY_FFdw6-IsWSYYek9tgI';
    setApiKey(activeKey);
    setModel(settings.model);
    setIsDemoMode(settings.isDemoMode);
    localStorage.setItem('ats_api_key', activeKey);
    localStorage.setItem('ats_model', settings.model);
    localStorage.setItem('ats_demo_mode', JSON.stringify(settings.isDemoMode));
    showToast('Settings saved successfully!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all resume data? This action cannot be undone.')) {
      setCvData(EMPTY_CV);
      localStorage.removeItem('ats_cv_data');
      showToast('All resume data cleared successfully.', 'warning');
    }
  };

  // AI Actions
  const handleAIImproveSummary = async () => {
    try {
      const polished = await improveSummary(apiKey, cvData.personal.summary, model, isDemoMode);
      setCvData((prev) => ({
        ...prev,
        personal: { ...prev.personal, summary: polished }
      }));
      showToast('Summary refined with AI!');
    } catch (err: any) {
      showToast(err.message || 'Failed to refine summary', 'danger');
    }
  };

  const handleAIImproveJob = async (index: number) => {
    try {
      const exp = cvData.experience[index];
      const polished = await improveBulletPoint(apiKey, exp.description, model, isDemoMode);
      const updatedExp = cvData.experience.map((item, i) => {
        if (i === index) {
          return { ...item, description: polished };
        }
        return item;
      });
      setCvData((prev) => ({ ...prev, experience: updatedExp }));
      showToast('Job description polished with AI!');
    } catch (err: any) {
      showToast(err.message || 'Failed to polish experience', 'danger');
    }
  };

  const handleTailorCV = async () => {
    try {
      const feedback = await tailorResume(apiKey, cvData, cvData.jobDescription, model, isDemoMode);
      setTailorFeedback(feedback);
      showToast('CV tailored successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to tailor CV', 'danger');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Header 
        theme={theme} 
        toggleTheme={handleToggleTheme} 
        openSettings={() => setIsSettingsOpen(true)} 
        isDemoMode={isDemoMode}
        onLogoClick={() => setView('landing')}
        onClearData={handleClearData}
      />

      {view === 'landing' ? (
        <LandingPage onStartBuilding={() => setView('builder')} />
      ) : (
        <main className="app-container">
          {/* Left Column: Form Editor */}
          <FormWizard 
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            cvData={cvData}
            setCvData={setCvData}
            onAIImproveSummary={handleAIImproveSummary}
            onAIImproveJob={handleAIImproveJob}
            onTailorCV={handleTailorCV}
            tailorFeedback={tailorFeedback}
          />

          {/* Right Column: Preview & Diagnostics */}
          <section className="preview-section">
            <div className="preview-tabs">
              <div className="tabs-buttons">
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                >
                  <FileText size={16} /> Live Preview
                </button>
                <button 
                  onClick={() => setActiveTab('ats')}
                  className={`tab-btn ${activeTab === 'ats' ? 'active' : ''}`}
                >
                  <CheckSquare size={16} /> ATS Score Analysis
                </button>
              </div>
              <button onClick={handlePrint} className="btn btn-primary btn-sm" style={{ gap: '0.25rem' }}>
                <Printer size={14} /> Save as PDF
              </button>
            </div>

            {/* Tab Content Rendering */}
            {activeTab === 'preview' ? (
              <ResumePreview cvData={cvData} />
            ) : (
              <ATSAnalysis cvData={cvData} />
            )}
          </section>
        </main>
      )}

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialApiKey={apiKey}
        initialModel={model}
        initialDemoMode={isDemoMode}
        onSave={handleSaveSettings}
      />

      {/* Dynamic Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <Check size={16} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
