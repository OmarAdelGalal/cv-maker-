import React, { useState } from 'react';
import { Cpu, Loader2, Bot } from 'lucide-react';

interface AITailorFormProps {
  jobDescription: string;
  onChangeJobDescription: (value: string) => void;
  onTailorCV: () => Promise<void>;
  tailorFeedback: string;
}

export default function AITailorForm({
  jobDescription,
  onChangeJobDescription,
  onTailorCV,
  tailorFeedback,
}: AITailorFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleTailor = async () => {
    if (!jobDescription?.trim()) return;
    setLoading(true);
    try {
      await onTailorCV();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Custom client-side markdown parsing for rendering Gemini responses beautifully
  const renderMarkdown = (mdText: string) => {
    if (!mdText) return null;
    const lines = mdText.split('\n');
    
    const parseBold = (text: string): React.ReactNode[] | string => {
      const parts = text.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{part}</strong>;
        }
        return part;
      });
    };

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} style={{ height: '0.5rem' }}></div>;
      }
      
      // Header 4
      if (trimmed.startsWith('#### ')) {
        return <h5 key={idx} style={{ marginTop: '0.75rem', marginBottom: '0.25rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{parseBold(trimmed.slice(5))}</h5>;
      }
      
      // Header 3
      if (trimmed.startsWith('### ')) {
        return <h4 key={idx} style={{ marginTop: '1.25rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>{parseBold(trimmed.slice(4))}</h4>;
      }
      
      // Header 2
      if (trimmed.startsWith('## ')) {
        return <h3 key={idx} style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.15rem' }}>{parseBold(trimmed.slice(3))}</h3>;
      }
      
      // Bullet list items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return <li key={idx} style={{ marginLeft: '1.25rem', listStyleType: 'disc', marginBottom: '0.25rem', paddingLeft: '0.25rem' }}>{parseBold(trimmed.slice(2))}</li>;
      }
      
      // Numbered list items
      const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return <li key={idx} style={{ marginLeft: '1.25rem', listStyleType: 'decimal', marginBottom: '0.25rem', paddingLeft: '0.25rem' }}>{parseBold(numMatch[2])}</li>;
      }
      
      // Normal paragraph
      return <p key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>{parseBold(trimmed)}</p>;
    });
  };

  return (
    <div className="form-step">
      <h2>AI ATS Tailoring</h2>
      <p className="step-description">Paste the description of the job you want to apply for. Our AI will analyze the CV and suggest optimizations to pass the ATS filter.</p>
      
      <div className="form-group col-span-2">
        <label htmlFor="jobDescription">Target Job Description</label>
        <textarea 
          id="jobDescription" 
          rows={8} 
          value={jobDescription}
          onChange={(e) => onChangeJobDescription(e.target.value)}
          placeholder="Paste the job requirements, responsibilities, and specifications here..."
        ></textarea>
      </div>

      <div className="ai-tailor-actions">
        <button 
          type="button" 
          onClick={handleTailor} 
          disabled={loading || !jobDescription?.trim()}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Analyzing Job Description...</span>
            </>
          ) : (
            <>
              <Cpu size={16} />
              <span>Tailor My CV with AI</span>
            </>
          )}
        </button>
      </div>

      {tailorFeedback && (
        <div className="ai-feedback-box">
          <div className="feedback-header">
            <Bot className="ai-avatar" size={20} />
            <h4 style={{ fontWeight: 600 }}>AI Analysis & Recommendations</h4>
          </div>
          <div className="feedback-content">
            {renderMarkdown(tailorFeedback)}
          </div>
        </div>
      )}
    </div>
  );
}
