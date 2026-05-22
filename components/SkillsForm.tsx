import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Skills } from '../lib/types';

interface SkillsFormProps {
  skills: Skills;
  onChange: (value: Skills) => void;
}

export default function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const [techInput, setTechInput] = useState<string>('');
  const [softInput, setSoftInput] = useState<string>('');
  const [langInput, setLangInput] = useState<string>('');

  const addSkill = (category: keyof Skills, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    
    // Prevent duplicates
    const currentList = skills[category] || [];
    if (currentList.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }

    onChange({
      ...skills,
      [category]: [...currentList, trimmed]
    });
  };

  const removeSkill = (category: keyof Skills, index: number) => {
    const currentList = skills[category] || [];
    const updated = currentList.filter((_, i) => i !== index);
    onChange({
      ...skills,
      [category]: updated
    });
  };

  const handleKeyDown = (category: keyof Skills, e: React.KeyboardEvent<HTMLInputElement>, setter: (val: string) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(category, (e.target as HTMLInputElement).value);
      setter('');
    }
  };

  const handleAddClick = (category: keyof Skills, value: string, setter: (val: string) => void) => {
    addSkill(category, value);
    setter('');
  };

  return (
    <div className="form-step">
      <h2>Skills & Expertise</h2>
      <p className="step-description">ATS software relies heavily on matching skills. Categorize and add relevant keywords.</p>
      
      <div className="skills-categories-container">
        
        {/* Category 1: Technical */}
        <div className="skills-category-box">
          <h3>Technical / Hard Skills</h3>
          <div className="skill-input-wrapper">
            <input 
              type="text" 
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown('technical', e, setTechInput)}
              placeholder="e.g. React, Python, PostgreSQL, AWS (Press Enter)" 
            />
            <button 
              type="button" 
              onClick={() => handleAddClick('technical', techInput, setTechInput)} 
              className="btn-icon"
              aria-label="Add technical skill"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="skills-tags-container">
            {(skills.technical || []).map((skill, index) => (
              <span key={index} className="skill-chip">
                <span>{skill}</span>
                <button type="button" onClick={() => removeSkill('technical', index)} aria-label={`Remove ${skill}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {(skills.technical || []).length === 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No technical skills added yet.</span>
            )}
          </div>
        </div>

        {/* Category 2: Soft */}
        <div className="skills-category-box">
          <h3>Soft Skills & Methodologies</h3>
          <div className="skill-input-wrapper">
            <input 
              type="text" 
              value={softInput}
              onChange={(e) => setSoftInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown('soft', e, setSoftInput)}
              placeholder="e.g. Scrum, Team Leadership, Critical Thinking" 
            />
            <button 
              type="button" 
              onClick={() => handleAddClick('soft', softInput, setSoftInput)} 
              className="btn-icon"
              aria-label="Add soft skill"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="skills-tags-container">
            {(skills.soft || []).map((skill, index) => (
              <span key={index} className="skill-chip">
                <span>{skill}</span>
                <button type="button" onClick={() => removeSkill('soft', index)} aria-label={`Remove ${skill}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {(skills.soft || []).length === 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No soft skills added yet.</span>
            )}
          </div>
        </div>

        {/* Category 3: Languages */}
        <div className="skills-category-box">
          <h3>Languages</h3>
          <div className="skill-input-wrapper">
            <input 
              type="text" 
              value={langInput}
              onChange={(e) => setLangInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown('languages', e, setLangInput)}
              placeholder="e.g. English (Fluent), Arabic (Native)" 
            />
            <button 
              type="button" 
              onClick={() => handleAddClick('languages', langInput, setLangInput)} 
              className="btn-icon"
              aria-label="Add language"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="skills-tags-container">
            {(skills.languages || []).map((skill, index) => (
              <span key={index} className="skill-chip">
                <span>{skill}</span>
                <button type="button" onClick={() => removeSkill('languages', index)} aria-label={`Remove ${skill}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {(skills.languages || []).length === 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No languages added yet.</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
