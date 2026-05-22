import React from 'react';
import { CVData } from '../lib/types';

interface ResumePreviewProps {
  cvData: CVData;
}

export default function ResumePreview({ cvData }: ResumePreviewProps) {
  const { personal, experience, education, skills, projects, certs } = cvData;

  // Format link for display (clean url)
  const cleanUrl = (url: string) => {
    if (!url) return '';
    return url.replace(/https?:\/\/(www\.)?/, '');
  };

  return (
    <div className="cv-paper-shadow">
      <div className="cv-paper" id="cv-render-area">
        
        {/* CV Header */}
        <div className="cv-header">
          <h1>{personal.fullName || 'YOUR FULL NAME'}</h1>
          {personal.jobTitle && <div className="subtitle">{personal.jobTitle}</div>}
          
          <div className="cv-contact-info">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && (
              <>
                {personal.email && <span>•</span>}
                <span>{personal.phone}</span>
              </>
            )}
            {personal.location && (
              <>
                {(personal.email || personal.phone) && <span>•</span>}
                <span>{personal.location}</span>
              </>
            )}
            {personal.website && (
              <>
                {(personal.email || personal.phone || personal.location) && <span>•</span>}
                <a href={personal.website} target="_blank" rel="noopener noreferrer">{cleanUrl(personal.website)}</a>
              </>
            )}
            {personal.linkedin && (
              <>
                {(personal.email || personal.phone || personal.location || personal.website) && <span>•</span>}
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">{cleanUrl(personal.linkedin)}</a>
              </>
            )}
            {personal.github && (
              <>
                {(personal.email || personal.phone || personal.location || personal.website || personal.linkedin) && <span>•</span>}
                <a href={personal.github} target="_blank" rel="noopener noreferrer">{cleanUrl(personal.github)}</a>
              </>
            )}
          </div>
        </div>

        {/* Professional Summary Section */}
        {personal.summary && (
          <div className="cv-section">
            <h2>Professional Summary</h2>
            <div className="cv-summary">{personal.summary}</div>
          </div>
        )}

        {/* Work Experience Section */}
        {experience && experience.length > 0 && (
          <div className="cv-section">
            <h2>Work Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="cv-item">
                <div className="cv-item-header">
                  <span>{exp.company || 'Company Name'}</span>
                  <span>{exp.startDate || 'Start'} – {exp.endDate || 'End'}</span>
                </div>
                <div className="cv-item-subheader">
                  <span>{exp.position || 'Position Title'}</span>
                  <span>{exp.location || 'Location'}</span>
                </div>
                {exp.description && (
                  <div className="cv-item-details bulleted">
                    {/* Render bullet points properly if split by newlines */}
                    {exp.description.includes('\n') ? (
                      <ul>
                        {exp.description.split('\n').filter(line => line.trim().length > 0).map((line, lIdx) => {
                          const cleanLine = line.replace(/^[-\*\u2022]\s*/, '');
                          return <li key={lIdx}>{cleanLine}</li>;
                        })}
                      </ul>
                    ) : (
                      <div>{exp.description}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="cv-section">
            <h2>Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="cv-item">
                <div className="cv-item-header">
                  <span>{edu.school || 'University Name'}</span>
                  <span>{edu.endDate || 'Graduation Date'}</span>
                </div>
                <div className="cv-item-subheader">
                  <span>{edu.degree || 'Degree and Field'}</span>
                  <span>{edu.location || 'Location'}</span>
                </div>
                {edu.description && (
                  <div className="cv-item-details">
                    <div>{edu.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        {((skills.technical && skills.technical.length > 0) || 
          (skills.soft && skills.soft.length > 0) || 
          (skills.languages && skills.languages.length > 0)) && (
          <div className="cv-section">
            <h2>Skills</h2>
            <div className="cv-skills-grid">
              {skills.technical && skills.technical.length > 0 && (
                <div className="cv-skills-row">
                  <span className="cv-skills-label">Technical Skills:</span>
                  <span className="cv-skills-list">{skills.technical.join(', ')}</span>
                </div>
              )}
              {skills.soft && skills.soft.length > 0 && (
                <div className="cv-skills-row">
                  <span className="cv-skills-label">Core Competencies:</span>
                  <span className="cv-skills-list">{skills.soft.join(', ')}</span>
                </div>
              )}
              {skills.languages && skills.languages.length > 0 && (
                <div className="cv-skills-row">
                  <span className="cv-skills-label">Languages:</span>
                  <span className="cv-skills-list">{skills.languages.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <div className="cv-section">
            <h2>Projects</h2>
            {projects.map((proj, index) => (
              <div key={index} className="cv-item">
                <div className="cv-item-header">
                  <span>{proj.title || 'Project Title'}</span>
                  {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9pt', fontWeight: 'normal' }}>{cleanUrl(proj.link)}</a>}
                </div>
                {proj.technologies && (
                  <div className="cv-item-subheader" style={{ marginBottom: '0.15rem' }}>
                    <span>Technologies: {proj.technologies}</span>
                  </div>
                )}
                {proj.description && (
                  <div className="cv-item-details">
                    <div>{proj.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications Section */}
        {certs && certs.length > 0 && (
          <div className="cv-section">
            <h2>Certifications</h2>
            {certs.map((cert, index) => (
              <div key={index} className="cv-item" style={{ marginBottom: '0.5rem' }}>
                <div className="cv-item-header">
                  <span>{cert.title || 'Certificate Title'}</span>
                  <span>{cert.date || 'Date'}</span>
                </div>
                <div className="cv-item-subheader">
                  <span>{cert.issuer || 'Issuing Organization'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
