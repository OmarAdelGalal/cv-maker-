export interface Personal {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  endDate: string;
  description: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
}

export interface CVData {
  personal: Personal;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  certs: Certificate[];
  jobDescription: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

export interface Settings {
  apiKey: string;
  model: string;
  isDemoMode: boolean;
}
