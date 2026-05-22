import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { Experience } from '../lib/types';

interface ExperienceFormProps {
  experienceList: Experience[];
  onChange: (value: Experience[]) => void;
  onAIImproveJob: (index: number) => Promise<void>;
}

export default function ExperienceForm({ experienceList, onChange, onAIImproveJob }: ExperienceFormProps) {
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  const handleAdd = () => {
    const newItem: Experience = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange([...experienceList, newItem]);
  };

  const handleRemove = (index: number) => {
    const updated = experienceList.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleItemChange = (index: number, field: keyof Experience, value: any) => {
    const updated = experienceList.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleAIImprove = async (index: number, currentText: string) => {
    if (!currentText?.trim()) return;
    setLoadingMap(prev => ({ ...prev, [index]: true }));
    try {
      await onAIImproveJob(index);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMap(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="form-step">
      <div className="step-header">
        <h2>Work Experience</h2>
        <button type="button" onClick={handleAdd} className="btn btn-secondary btn-sm">
          <Plus size={14} /> Add Job
        </button>
      </div>
      <p className="step-description">List your work history starting with the most recent. Use bullet points for accomplishments.</p>
      
      <div className="dynamic-list">
        {experienceList.map((exp, index) => (
          <div key={index} className="list-item">
            <button 
              type="button" 
              onClick={() => handleRemove(index)} 
              className="delete-item-btn" 
              title="Remove Job"
            >
              <Trash2 size={16} />
            </button>

            <div className="form-grid">
              <div className="form-group">
                <label>Company / Organization</label>
                <input 
                  type="text" 
                  value={exp.company || ''} 
                  onChange={(e) => handleItemChange(index, 'company', e.target.value)} 
                  placeholder="Acme Corp" 
                />
              </div>
              <div className="form-group">
                <label>Job Title</label>
                <input 
                  type="text" 
                  value={exp.position || ''} 
                  onChange={(e) => handleItemChange(index, 'position', e.target.value)} 
                  placeholder="Software Engineer" 
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  value={exp.location || ''} 
                  onChange={(e) => handleItemChange(index, 'location', e.target.value)} 
                  placeholder="Boston, MA" 
                />
              </div>
              <div className="form-grid" style={{ gridColumn: 'span 1', gap: '0.5rem', padding: 0 }}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input 
                    type="text" 
                    value={exp.startDate || ''} 
                    onChange={(e) => handleItemChange(index, 'startDate', e.target.value)} 
                    placeholder="MM/YYYY or Year" 
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    type="text" 
                    value={exp.current ? 'Present' : (exp.endDate || '')} 
                    onChange={(e) => handleItemChange(index, 'endDate', e.target.value)} 
                    placeholder="MM/YYYY or Year" 
                    disabled={exp.current}
                  />
                </div>
                <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                  <input 
                    type="checkbox" 
                    id={`current-job-${index}`}
                    checked={exp.current || false} 
                    onChange={(e) => {
                      handleItemChange(index, 'current', e.target.checked);
                      if (e.target.checked) handleItemChange(index, 'endDate', 'Present');
                    }}
                  />
                  <label htmlFor={`current-job-${index}`} style={{ cursor: 'pointer', fontSize: '0.75rem' }}>Currently Work Here</label>
                </div>
              </div>
              <div className="form-group col-span-2">
                <label>Description / Key Achievements</label>
                <textarea 
                  rows={4} 
                  value={exp.description || ''} 
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                  placeholder="- Designed and implemented microservices using React and Node.js.&#10;- Optimized database queries, reducing API latency by 30%.&#10;- Led a team of 3 junior developers to deliver projects on time."
                ></textarea>
                <div className="textarea-actions">
                  <button 
                    type="button" 
                    onClick={() => handleAIImprove(index, exp.description)} 
                    disabled={loadingMap[index] || !exp.description?.trim()}
                    className="btn-ai-action"
                  >
                    {loadingMap[index] ? (
                      <>
                        <Loader2 className="animate-spin" size={12} />
                        <span>Polishing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        <span>AI Polish Bullet Points</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {experienceList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
          No experience nodes added. Click "Add Job" to start.
        </div>
      )}
    </div>
  );
}
