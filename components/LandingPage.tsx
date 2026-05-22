import React from 'react';
import { Sparkles, Cpu, CheckSquare, ArrowRight, Lock, Eye, ShieldCheck, FileText } from 'lucide-react';

interface LandingPageProps {
  onStartBuilding: () => void;
}

export default function LandingPage({ onStartBuilding }: LandingPageProps) {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-badge">
          <Sparkles size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          <span>Next-Generation Resume Optimization</span>
        </div>
        
        <h1 className="landing-title">
          Build an <span>ATS-Proof</span> Resume in Minutes
        </h1>
        
        <p className="landing-subtitle">
          Optimize your resume structure, refine bullet points, and match key-phrases using Google Gemini AI to pass applicant tracking systems and secure more interviews.
        </p>
        
        <div className="landing-ctas">
          <button 
            id="start-building-btn"
            onClick={onStartBuilding} 
            className="btn btn-primary btn-lg"
            style={{ gap: '0.5rem' }}
          >
            Start Building Your CV <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="landing-trust">
          <span><Lock size={14} /> Local browser storage</span>
          <span>•</span>
          <span><ShieldCheck size={14} /> 100% Free & Open Source</span>
          <span>•</span>
          <span><Eye size={14} /> No Login Required</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features">
        <div className="card feature-card">
          <div className="feature-icon-wrapper">
            <Cpu size={24} />
          </div>
          <h3>Google Gemini AI Power</h3>
          <p>Instantly polish your professional summary and experience bullet points into achievement-oriented statements using advanced neural language models.</p>
        </div>

        <div className="card feature-card">
          <div className="feature-icon-wrapper">
            <CheckSquare size={24} />
          </div>
          <h3>ATS Checker & Score</h3>
          <p>Our real-time diagnostics engine checks contact formatting, section completeness, proper layout structures, and gives you an immediate compatibility grade.</p>
        </div>

        <div className="card feature-card">
          <div className="feature-icon-wrapper">
            <FileText size={24} />
          </div>
          <h3>Keyword Density Match</h3>
          <p>Paste target job descriptions to extract high-priority technical terms, matching them against your resume text to eliminate critical keyword gaps.</p>
        </div>
      </section>

      {/* ATS Statistics Section */}
      <section className="landing-stats">
        <div className="stats-text">
          <h2>Why ATS Optimization Matters</h2>
          <p>
            Over 75% of resumes are automatically filtered out by Applicant Tracking Systems (ATS) before they ever reach a recruiter's desk. This usually happens due to parsing errors (like complex layouts, images, and text boxes) or low keyword match rates. 
            <br /><br />
            SmartPath AI enforces a strict, clean, single-column design and ensures optimal keyword placement so your resume stands out in recruiter search results.
          </p>
        </div>
        <div className="stats-numbers">
          <div className="stat-item">
            <div className="stat-num">75%</div>
            <div className="stat-lbl">Resumes Filtered Out<br />by ATS Systems</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">3x</div>
            <div className="stat-lbl">Higher Response Rate<br />with Tailored Resumes</div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="landing-steps">
        <h2 className="steps-title">How SmartPath AI Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-card-num">1</div>
            <h4>Input Profile</h4>
            <p>Fill out your details in our structured, clean wizard editor.</p>
          </div>
          <div className="step-card">
            <div className="step-card-num">2</div>
            <h4>Paste Job Post</h4>
            <p>Paste the target job description to match key-phrases.</p>
          </div>
          <div className="step-card">
            <div className="step-card-num">3</div>
            <h4>Optimize with AI</h4>
            <p>Enhance bullet points and summary with direct Gemini API actions.</p>
          </div>
          <div className="step-card">
            <div className="step-card-num">4</div>
            <h4>Download clean PDF</h4>
            <p>Export a clean, text-selectable PDF that is perfect for ATS scanners.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
