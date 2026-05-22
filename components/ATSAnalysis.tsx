import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { scanResume, ScanResult } from '../lib/atsScanner';
import { CVData } from '../lib/types';

interface ATSAnalysisProps {
  cvData: CVData;
}

export default function ATSAnalysis({ cvData }: ATSAnalysisProps) {
  const [analysis, setAnalysis] = useState<ScanResult>({
    score: 0,
    checklist: [],
    matchedKeywords: [],
    missingKeywords: []
  });

  useEffect(() => {
    const result = scanResume(cvData, cvData.jobDescription || '');
    setAnalysis(result);
  }, [cvData]);

  // Dashoffset calculation for gauge SVG: 2 * PI * r = 2 * 3.14159 * 45 = 282.74
  const dashoffset = 283 - (283 * analysis.score) / 100;

  // Compute rating tier
  let ratingBadgeClass = 'badge';
  let ratingText = 'Draft';
  if (analysis.score >= 80) {
    ratingBadgeClass += ' success';
    ratingText = 'Excellent';
  } else if (analysis.score >= 60) {
    ratingBadgeClass += ' warning';
    ratingText = 'Good';
  } else if (analysis.score >= 40) {
    ratingBadgeClass += ' warning';
    ratingText = 'Fair';
  } else {
    ratingBadgeClass += ' danger';
    ratingText = 'Needs Work';
  }

  return (
    <div className="ats-diagnostics-container" style={{ display: 'block' }}>
      <div className="card ats-score-card">
        
        {/* Score gauge and status */}
        <div className="ats-meter-container">
          <div className="ats-gauge">
            <svg viewBox="0 0 100 100" className="gauge-svg">
              <circle cx="50" cy="50" r="45" className="gauge-bg"></circle>
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                className="gauge-fill" 
                style={{ 
                  strokeDashoffset: dashoffset, 
                  stroke: analysis.score >= 80 ? 'var(--accent-success)' : analysis.score >= 60 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                }}
              ></circle>
            </svg>
            <div className="gauge-value">{analysis.score}%</div>
          </div>
          <div className="ats-status-info">
            <h3>ATS Compatibility Score</h3>
            <p className={ratingBadgeClass}>{ratingText}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {analysis.score >= 80 
                ? 'Your resume has excellent formatting and high keyword density!' 
                : 'Review the diagnostic details below to boost your ATS compatibility.'}
            </p>
          </div>
        </div>

        {/* Diagnostics Checklist */}
        <div className="ats-checklist">
          <h3>Diagnostic Checklist</h3>
          <ul>
            {analysis.checklist.map((item, idx) => {
              let icon = <CheckCircle2 size={16} />;
              let liClass = 'pass';
              if (item.status === 'fail') {
                icon = <XCircle size={16} />;
                liClass = 'fail';
              } else if (item.status === 'warn') {
                icon = <AlertTriangle size={16} />;
                liClass = 'warn';
              }

              return (
                <li key={idx} className={liClass}>
                  {icon}
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Keyword Matcher */}
        <div className="ats-keywords-analysis">
          <h3>Keyword Density Matcher</h3>
          {!cvData.jobDescription ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Paste a target job description in the AI Optimization step to automatically parse and check keyword matches.
            </p>
          ) : (
            <>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                We scanned the job description and matched it against the text in your resume.
              </p>
              <div className="keywords-grid">
                <div className="keyword-status-box">
                  <h4>Matched Keywords ({analysis.matchedKeywords.length})</h4>
                  <div className="keywords-tags-container matched">
                    {analysis.matchedKeywords.map((kw, idx) => (
                      <span key={idx} className="skill-chip">{kw}</span>
                    ))}
                    {analysis.matchedKeywords.length === 0 && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No keywords matched yet.</span>
                    )}
                  </div>
                </div>
                <div className="keyword-status-box">
                  <h4>Missing Keywords ({analysis.missingKeywords.length})</h4>
                  <div className="keywords-tags-container missing">
                    {analysis.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="skill-chip">{kw}</span>
                    ))}
                    {analysis.missingKeywords.length === 0 && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No missing keywords detected!</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
