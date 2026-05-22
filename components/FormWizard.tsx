import React from 'react';
import { User, Briefcase, GraduationCap, Wrench, FolderGit2, BrainCircuit, ArrowLeft, ArrowRight } from 'lucide-react';
import PersonalForm from './PersonalForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';
import AITailorForm from './AITailorForm';
import { CVData } from '../lib/types';

interface FormWizardProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  onAIImproveSummary: () => Promise<void>;
  onAIImproveJob: (index: number) => Promise<void>;
  onTailorCV: () => Promise<void>;
  tailorFeedback: string;
}

export default function FormWizard({
  currentStep,
  setCurrentStep,
  cvData,
  setCvData,
  onAIImproveSummary,
  onAIImproveJob,
  onTailorCV,
  tailorFeedback,
}: FormWizardProps) {
  const steps = [
    { num: 1, title: 'Contact Info', icon: <User size={16} /> },
    { num: 2, title: 'Work Experience', icon: <Briefcase size={16} /> },
    { num: 3, title: 'Education', icon: <GraduationCap size={16} /> },
    { num: 4, title: 'Skills', icon: <Wrench size={16} /> },
    { num: 5, title: 'Projects & Certs', icon: <FolderGit2 size={16} /> },
    { num: 6, title: 'AI Optimization', icon: <BrainCircuit size={16} /> }
  ];

  // Calculate progress fill percentage
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  // Smooth scroll form container to top on step change
  React.useEffect(() => {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
      formContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section className="editor-section card">
      {/* Steps timeline progress indicator */}
      <div className="steps-progress">
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="steps-nodes">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            let nodeClass = 'step-node';
            if (isActive) nodeClass += ' active';
            if (isCompleted) nodeClass += ' completed';
            
            return (
              <div 
                key={s.num} 
                onClick={() => setCurrentStep(s.num)}
                className={nodeClass} 
                title={s.title}
              >
                {s.icon}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic step form container */}
      <div className="form-container">
        {currentStep === 1 && (
          <PersonalForm 
            data={cvData.personal} 
            onChange={(val) => setCvData({ ...cvData, personal: val })} 
            onAIImproveSummary={onAIImproveSummary}
          />
        )}
        
        {currentStep === 2 && (
          <ExperienceForm 
            experienceList={cvData.experience} 
            onChange={(val) => setCvData({ ...cvData, experience: val })}
            onAIImproveJob={onAIImproveJob}
          />
        )}

        {currentStep === 3 && (
          <EducationForm 
            educationList={cvData.education} 
            onChange={(val) => setCvData({ ...cvData, education: val })}
          />
        )}

        {currentStep === 4 && (
          <SkillsForm 
            skills={cvData.skills} 
            onChange={(val) => setCvData({ ...cvData, skills: val })}
          />
        )}

        {currentStep === 5 && (
          <ProjectsForm 
            projects={cvData.projects}
            certs={cvData.certs}
            onProjectsChange={(val) => setCvData({ ...cvData, projects: val })}
            onCertsChange={(val) => setCvData({ ...cvData, certs: val })}
          />
        )}

        {currentStep === 6 && (
          <AITailorForm 
            jobDescription={cvData.jobDescription}
            onChangeJobDescription={(val) => setCvData({ ...cvData, jobDescription: val })}
            onTailorCV={onTailorCV}
            tailorFeedback={tailorFeedback}
          />
        )}
      </div>

      {/* Step navigation buttons */}
      <div className="editor-footer">
        <button 
          onClick={handleBack} 
          className={`btn btn-secondary ${currentStep === 1 ? 'hidden' : ''}`}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button 
          onClick={handleNext} 
          className={`btn btn-primary ${currentStep === steps.length ? 'hidden' : ''}`}
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
