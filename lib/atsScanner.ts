import { CVData } from './types';

/**
 * ATS Scanner rules engine
 */

const COMMON_TECH_KEYWORDS: string[] = [
  'react', 'angular', 'vue', 'nextjs', 'next.js', 'svelte', 'nuxt', 'node', 'nodejs', 'node.js',
  'express', 'nestjs', 'python', 'django', 'flask', 'fastapi', 'ruby', 'rails', 'java', 'spring',
  'kotlin', 'swift', 'objective-c', 'flutter', 'react native', 'typescript', 'javascript',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'sql', 'mysql', 'postgres', 'postgresql',
  'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'sqlite', 'aws', 'azure', 'gcp',
  'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'ci/cd', 'devops', 'terraform',
  'graphql', 'rest api', 'soap', 'microservices', 'serverless', 'agile', 'scrum', 'kanban',
  'testing', 'jest', 'cypress', 'mocha', 'selenium', 'machine learning', 'deep learning',
  'data science', 'ai', 'artificial intelligence', 'nlp', 'pytorch', 'tensorflow', 'pandas',
  'numpy', 'scikit-learn', 'project management', 'team leadership', 'product owner', 'figma'
];

/**
 * Extracts potential keywords from a block of text
 */
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  const normalized = text.toLowerCase();
  
  // Method 1: Check against our predefined dictionary of technical terms
  const foundInDict = COMMON_TECH_KEYWORDS.filter(keyword => {
    // Exact word boundary matching
    const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(normalized);
  });

  // Method 2: Extract sequences of capital letters or alphanumeric words that appear important
  // (e.g. acronyms like AWS, API, CI/CD, SQL, etc.)
  const acronymRegex = /\b[A-Z]{2,}(?:\/[A-Z]+)?\b/g;
  const acronymMatches = text.match(acronymRegex) || [];
  const foundAcronyms = acronymMatches.map(a => a.toLowerCase());

  const allKeywords = Array.from(new Set([...foundInDict, ...foundAcronyms]));
  
  // Format nicely (capitalize first letters)
  return allKeywords.map(k => {
    // Special formatting for acronyms
    if (k.length <= 4 || ['aws', 'gcp', 'sql', 'api', 'git', 'css', 'nlp', 'vcs', 'scrum'].includes(k)) {
      return k.toUpperCase();
    }
    // Standard capitalization
    return k.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  });
}

export interface ChecklistItem {
  id: string;
  status: 'pass' | 'warn' | 'fail';
  text: string;
}

export interface ScanResult {
  score: number;
  checklist: ChecklistItem[];
  matchedKeywords: string[];
  missingKeywords: string[];
}

/**
 * Scans resume details and evaluates ATS compatibility
 */
export function scanResume(resumeData: CVData, jobDescription: string = ''): ScanResult {
  let score = 0;
  const checklist: ChecklistItem[] = [];
  
  // 1. Personal Details (Max: 20 points)
  let contactScore = 0;
  if (resumeData.personal?.fullName?.trim()) contactScore += 5;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (resumeData.personal?.email && emailRegex.test(resumeData.personal.email.trim())) {
    contactScore += 5;
    checklist.push({ id: 'email', status: 'pass', text: 'Valid email address provided.' });
  } else {
    checklist.push({ id: 'email', status: 'fail', text: 'Provide a valid contact email address.' });
  }

  const phoneRegex = /^[\+\d\s\-\(\)\.]{7,20}$/;
  if (resumeData.personal?.phone && phoneRegex.test(resumeData.personal.phone.trim())) {
    contactScore += 5;
    checklist.push({ id: 'phone', status: 'pass', text: 'Valid phone number provided.' });
  } else {
    checklist.push({ id: 'phone', status: 'fail', text: 'Provide a valid phone number (minimum 7 digits).' });
  }

  if (resumeData.personal?.location?.trim()) {
    contactScore += 5;
    checklist.push({ id: 'location', status: 'pass', text: 'Location (city, country) is specified.' });
  } else {
    checklist.push({ id: 'location', status: 'warn', text: 'Consider adding your location (e.g. New York, NY) to assist local filters.' });
  }
  score += contactScore;

  // 2. Section Checks (Max: 25 points)
  let sectionsScore = 0;
  if (resumeData.experience && resumeData.experience.length > 0) {
    sectionsScore += 10;
    checklist.push({ id: 'experience', status: 'pass', text: `Work experience section present (${resumeData.experience.length} job(s) listed).` });
  } else {
    checklist.push({ id: 'experience', status: 'fail', text: 'Missing work experience! Standard ATS systems fail resumes with no job history.' });
  }

  if (resumeData.education && resumeData.education.length > 0) {
    sectionsScore += 10;
    checklist.push({ id: 'education', status: 'pass', text: `Education section present (${resumeData.education.length} school(s) listed).` });
  } else {
    checklist.push({ id: 'education', status: 'fail', text: 'Missing education section! List your academic background.' });
  }

  const totalSkillsCount = (resumeData.skills?.technical?.length || 0) + (resumeData.skills?.soft?.length || 0);
  if (totalSkillsCount >= 5) {
    sectionsScore += 5;
    checklist.push({ id: 'skills', status: 'pass', text: `Rich skills section present (${totalSkillsCount} total skills listed).` });
  } else if (totalSkillsCount > 0) {
    sectionsScore += 3;
    checklist.push({ id: 'skills', status: 'warn', text: `Skills list is light. Try adding at least 5 tech/soft skills.` });
  } else {
    checklist.push({ id: 'skills', status: 'fail', text: 'Missing skills! ATS parsers rank candidates primarily on skill keywords.' });
  }
  score += sectionsScore;

  // 3. Length & Word Count (Max: 20 points)
  let lengthScore = 0;
  
  // Calculate total resume text words
  let resumeText = `${resumeData.personal?.fullName || ''} ${resumeData.personal?.jobTitle || ''} ${resumeData.personal?.summary || ''} `;
  resumeData.experience?.forEach(exp => {
    resumeText += `${exp.company} ${exp.position} ${exp.description} `;
  });
  resumeData.education?.forEach(edu => {
    resumeText += `${edu.school} ${edu.degree} ${edu.description} `;
  });
  resumeData.projects?.forEach(proj => {
    resumeText += `${proj.title} ${proj.description} `;
  });
  resumeData.skills?.technical?.forEach(s => resumeText += `${s} `);
  resumeData.skills?.soft?.forEach(s => resumeText += `${s} `);

  const wordCount = resumeText.split(/\s+/).filter(w => w.trim().length > 0).length;

  if (wordCount >= 400 && wordCount <= 800) {
    lengthScore += 10;
    checklist.push({ id: 'wordcount', status: 'pass', text: `Optimal resume length (${wordCount} words). Fits on a standard 1-2 pages.` });
  } else if (wordCount > 0 && wordCount < 400) {
    lengthScore += 5;
    checklist.push({ id: 'wordcount', status: 'warn', text: `Resume is too short (${wordCount} words). Expand on your experience and achievements.` });
  } else if (wordCount > 800) {
    lengthScore += 5;
    checklist.push({ id: 'wordcount', status: 'warn', text: `Resume is quite long (${wordCount} words). Keep it concise. Standard targets are 400-800 words.` });
  } else {
    checklist.push({ id: 'wordcount', status: 'fail', text: 'Resume is empty. Fill out the forms to begin.' });
  }

  // Summary check
  const summaryWordCount = (resumeData.personal?.summary || '').split(/\s+/).filter(w => w.trim().length > 0).length;
  if (summaryWordCount >= 30 && summaryWordCount <= 90) {
    lengthScore += 10;
    checklist.push({ id: 'summary-length', status: 'pass', text: `Professional summary length is optimal (${summaryWordCount} words).` });
  } else if (summaryWordCount > 0 && summaryWordCount < 30) {
    lengthScore += 5;
    checklist.push({ id: 'summary-length', status: 'warn', text: 'Professional summary is brief. Expand to at least 30 words to summarize your value proposition.' });
  } else if (summaryWordCount > 90) {
    lengthScore += 5;
    checklist.push({ id: 'summary-length', status: 'warn', text: 'Professional summary is too wordy. Keep it under 90 words.' });
  } else {
    checklist.push({ id: 'summary-length', status: 'warn', text: 'Consider adding a Professional Summary section at the top.' });
  }
  score += lengthScore;

  // 4. Placeholders & Clichés Check (Max: 15 points)
  let cleanScore = 15;
  const placeholderRegex = /lorem ipsum|todo|\[your name\]|\[company name\]|example/i;
  if (placeholderRegex.test(resumeText)) {
    cleanScore = 0;
    checklist.push({ id: 'placeholders', status: 'fail', text: 'Draft placeholders detected (e.g. "Lorem Ipsum", "TODO"). Remove them before sending.' });
  } else if (wordCount > 0) {
    checklist.push({ id: 'placeholders', status: 'pass', text: 'No drafting placeholders detected.' });
  }
  score += cleanScore;

  // 5. Keyword Density Matching (Max: 20 points)
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  let keywordScore = 0;

  if (jobDescription && jobDescription.trim().length > 0) {
    const jdKeywords = extractKeywords(jobDescription);
    const resumeTextLower = resumeText.toLowerCase();

    jdKeywords.forEach(kw => {
      // Escape for regex
      const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      
      if (regex.test(resumeTextLower)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const totalJdKeywords = jdKeywords.length;
    if (totalJdKeywords > 0) {
      const matchRatio = matchedKeywords.length / totalJdKeywords;
      keywordScore = Math.round(matchRatio * 20);
      
      const percentage = Math.round(matchRatio * 100);
      if (percentage >= 70) {
        checklist.push({ id: 'keywords', status: 'pass', text: `Excellent keyword match! (${percentage}% - ${matchedKeywords.length} of ${totalJdKeywords} found).` });
      } else if (percentage >= 40) {
        checklist.push({ id: 'keywords', status: 'warn', text: `Moderate keyword match (${percentage}%). Add missing keywords to increase ranking.` });
      } else {
        checklist.push({ id: 'keywords', status: 'fail', text: `Weak keyword match (${percentage}%). Tailor your experience or skills to match the job post.` });
      }
    } else {
      keywordScore = 10;
      checklist.push({ id: 'keywords', status: 'warn', text: 'No technical keywords identified in the job description.' });
    }
  } else {
    // If no JD is provided, award a basic 10 points
    keywordScore = 10;
    if (wordCount > 0) {
      checklist.push({ id: 'keywords', status: 'warn', text: 'Paste a target Job Description in Step 6 to enable keyword density analysis.' });
    }
  }
  score += keywordScore;

  // Normalize final score to cap at 100
  score = Math.min(Math.max(score, 0), 100);

  // Return full dashboard details
  return {
    score,
    checklist,
    matchedKeywords,
    missingKeywords,
  };
}
