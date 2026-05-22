import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Personal } from '../lib/types';

interface PersonalFormProps {
  data: Personal;
  onChange: (value: Personal) => void;
  onAIImproveSummary: () => Promise<void>;
}

export default function PersonalForm({ data, onChange, onAIImproveSummary }: PersonalFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof Personal, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleAIImprove = async () => {
    if (!data.summary?.trim()) return;
    setLoading(true);
    try {
      await onAIImproveSummary();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-step">
      <h2>Personal Details</h2>
      <p className="step-description">Introduce yourself and provide contact information. ATS systems look for these first.</p>
      
      <div className="form-grid">
        <div className="form-group col-span-2">
          <label htmlFor="fullName">Full Name</label>
          <input 
            type="text" 
            id="fullName" 
            value={data.fullName || ''} 
            onChange={(e) => handleInputChange('fullName', e.target.value)} 
            placeholder="John Doe" 
            required 
          />
        </div>
        <div className="form-group col-span-2">
          <label htmlFor="jobTitle">Target Job Title</label>
          <input 
            type="text" 
            id="jobTitle" 
            value={data.jobTitle || ''} 
            onChange={(e) => handleInputChange('jobTitle', e.target.value)} 
            placeholder="Senior Full-Stack Developer" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            value={data.email || ''} 
            onChange={(e) => handleInputChange('email', e.target.value)} 
            placeholder="john.doe@example.com" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            value={data.phone || ''} 
            onChange={(e) => handleInputChange('phone', e.target.value)} 
            placeholder="+1 (555) 123-4567" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input 
            type="text" 
            id="location" 
            value={data.location || ''} 
            onChange={(e) => handleInputChange('location', e.target.value)} 
            placeholder="New York, NY" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="website">Portfolio Website</label>
          <input 
            type="url" 
            id="website" 
            value={data.website || ''} 
            onChange={(e) => handleInputChange('website', e.target.value)} 
            placeholder="https://johndoe.dev" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn Profile</label>
          <input 
            type="url" 
            id="linkedin" 
            value={data.linkedin || ''} 
            onChange={(e) => handleInputChange('linkedin', e.target.value)} 
            placeholder="https://linkedin.com/in/johndoe" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="github">GitHub Profile</label>
          <input 
            type="url" 
            id="github" 
            value={data.github || ''} 
            onChange={(e) => handleInputChange('github', e.target.value)} 
            placeholder="https://github.com/johndoe" 
          />
        </div>
        <div className="form-group col-span-2">
          <label htmlFor="summary">Professional Summary</label>
          <textarea 
            id="summary" 
            rows={4} 
            value={data.summary || ''} 
            onChange={(e) => handleInputChange('summary', e.target.value)} 
            placeholder="Briefly describe your career goals and key strengths..."
          ></textarea>
          <div className="textarea-actions">
            <button 
              type="button" 
              onClick={handleAIImprove} 
              disabled={loading || !data.summary?.trim()}
              className="btn-ai-action"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={12} />
                  <span>Polishing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  <span>AI Refine Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
