import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Education } from '../lib/types';

interface EducationFormProps {
  educationList: Education[];
  onChange: (value: Education[]) => void;
}

export default function EducationForm({ educationList, onChange }: EducationFormProps) {
  const handleAdd = () => {
    const newItem: Education = {
      school: '',
      degree: '',
      location: '',
      endDate: '',
      description: ''
    };
    onChange([...educationList, newItem]);
  };

  const handleRemove = (index: number) => {
    const updated = educationList.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleItemChange = (index: number, field: keyof Education, value: string) => {
    const updated = educationList.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  return (
    <div className="form-step">
      <div className="step-header">
        <h2>Education</h2>
        <button type="button" onClick={handleAdd} className="btn btn-secondary btn-sm">
          <Plus size={14} /> Add Education
        </button>
      </div>
      <p className="step-description">List your academic qualifications. Focus on your degrees and graduating institution details.</p>
      
      <div className="dynamic-list">
        {educationList.map((edu, index) => (
          <div key={index} className="list-item">
            <button 
              type="button" 
              onClick={() => handleRemove(index)} 
              className="delete-item-btn" 
              title="Remove Education"
            >
              <Trash2 size={16} />
            </button>

            <div className="form-grid">
              <div className="form-group col-span-2">
                <label>School / University</label>
                <input 
                  type="text" 
                  value={edu.school || ''} 
                  onChange={(e) => handleItemChange(index, 'school', e.target.value)} 
                  placeholder="Massachusetts Institute of Technology" 
                />
              </div>
              <div className="form-group">
                <label>Degree & Major</label>
                <input 
                  type="text" 
                  value={edu.degree || ''} 
                  onChange={(e) => handleItemChange(index, 'degree', e.target.value)} 
                  placeholder="B.S. in Computer Science" 
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  value={edu.location || ''} 
                  onChange={(e) => handleItemChange(index, 'location', e.target.value)} 
                  placeholder="Cambridge, MA" 
                />
              </div>
              <div className="form-group">
                <label>Graduation Date</label>
                <input 
                  type="text" 
                  value={edu.endDate || ''} 
                  onChange={(e) => handleItemChange(index, 'endDate', e.target.value)} 
                  placeholder="MM/YYYY or Year" 
                />
              </div>
              <div className="form-group col-span-2">
                <label>Additional Info (GPA, Honors, Activities)</label>
                <textarea 
                  rows={2} 
                  value={edu.description || ''} 
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                  placeholder="GPA: 3.8/4.0. Completed minor in Mathematics. Recipient of Dean's Honor List."
                ></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>

      {educationList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
          No education nodes added. Click "Add Education" to start.
        </div>
      )}
    </div>
  );
}
