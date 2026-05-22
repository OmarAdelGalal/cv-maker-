import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Project, Certificate } from '../lib/types';

interface ProjectsFormProps {
  projects: Project[];
  certs: Certificate[];
  onProjectsChange: (value: Project[]) => void;
  onCertsChange: (value: Certificate[]) => void;
}

export default function ProjectsForm({
  projects,
  certs,
  onProjectsChange,
  onCertsChange,
}: ProjectsFormProps) {
  
  // Projects handlers
  const handleAddProject = () => {
    const newItem: Project = {
      title: '',
      description: '',
      technologies: '',
      link: ''
    };
    onProjectsChange([...projects, newItem]);
  };

  const handleRemoveProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    onProjectsChange(updated);
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    const updated = projects.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onProjectsChange(updated);
  };

  // Certifications handlers
  const handleAddCert = () => {
    const newItem: Certificate = {
      title: '',
      issuer: '',
      date: ''
    };
    onCertsChange([...certs, newItem]);
  };

  const handleRemoveCert = (index: number) => {
    const updated = certs.filter((_, i) => i !== index);
    onCertsChange(updated);
  };

  const handleCertChange = (index: number, field: keyof Certificate, value: string) => {
    const updated = certs.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onCertsChange(updated);
  };

  return (
    <div className="form-step">
      {/* PROJECTS SECTION */}
      <div className="step-header">
        <h2>Projects</h2>
        <button type="button" onClick={handleAddProject} className="btn btn-secondary btn-sm">
          <Plus size={14} /> Add Project
        </button>
      </div>
      <p className="step-description">Highlight relevant side projects or open-source contributions that demonstrate your skills.</p>
      
      <div className="dynamic-list margin-bottom-lg">
        {projects.map((proj, index) => (
          <div key={index} className="list-item">
            <button 
              type="button" 
              onClick={() => handleRemoveProject(index)} 
              className="delete-item-btn" 
              title="Remove Project"
            >
              <Trash2 size={16} />
            </button>

            <div className="form-grid">
              <div className="form-group col-span-2">
                <label>Project Title</label>
                <input 
                  type="text" 
                  value={proj.title || ''} 
                  onChange={(e) => handleProjectChange(index, 'title', e.target.value)} 
                  placeholder="E-commerce Analytics Dashboard" 
                />
              </div>
              <div className="form-group">
                <label>Technologies Used</label>
                <input 
                  type="text" 
                  value={proj.technologies || ''} 
                  onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)} 
                  placeholder="React, Next.js, Node.js, TailwindCSS" 
                />
              </div>
              <div className="form-group">
                <label>Project Link</label>
                <input 
                  type="url" 
                  value={proj.link || ''} 
                  onChange={(e) => handleProjectChange(index, 'link', e.target.value)} 
                  placeholder="https://github.com/johndoe/project" 
                />
              </div>
              <div className="form-group col-span-2">
                <label>Project Description</label>
                <textarea 
                  rows={2} 
                  value={proj.description || ''} 
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)} 
                  placeholder="Built a real-time metrics dashboard processing over 10k daily events. Integrated charting APIs and customized responsive grid layouts."
                ></textarea>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
            No projects added. Click "Add Project" to add.
          </div>
        )}
      </div>

      {/* CERTIFICATIONS SECTION */}
      <div className="step-header" style={{ marginTop: '2rem' }}>
        <h2>Certifications & Awards</h2>
        <button type="button" onClick={handleAddCert} className="btn btn-secondary btn-sm">
          <Plus size={14} /> Add Cert
        </button>
      </div>
      <p className="step-description">Display standard professional certifications, bootcamps, or courses.</p>
      
      <div className="dynamic-list">
        {certs.map((cert, index) => (
          <div key={index} className="list-item">
            <button 
              type="button" 
              onClick={() => handleRemoveCert(index)} 
              aria-label="Remove Cert"
              className="delete-item-btn" 
              title="Remove Cert"
            >
              <Trash2 size={16} />
            </button>

            <div className="form-grid">
              <div className="form-group col-span-2">
                <label>Certificate Title</label>
                <input 
                  type="text" 
                  value={cert.title || ''} 
                  onChange={(e) => handleCertChange(index, 'title', e.target.value)} 
                  placeholder="AWS Certified Solutions Architect - Associate" 
                />
              </div>
              <div className="form-group">
                <label>Issuing Organization</label>
                <input 
                  type="text" 
                  value={cert.issuer || ''} 
                  onChange={(e) => handleCertChange(index, 'issuer', e.target.value)} 
                  placeholder="Amazon Web Services" 
                />
              </div>
              <div className="form-group">
                <label>Date Issued</label>
                <input 
                  type="text" 
                  value={cert.date || ''} 
                  onChange={(e) => handleCertChange(index, 'date', e.target.value)} 
                  placeholder="MM/YYYY or Year" 
                />
              </div>
            </div>
          </div>
        ))}
        {certs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
            No certifications added. Click "Add Cert" to add.
          </div>
        )}
      </div>

    </div>
  );
}
