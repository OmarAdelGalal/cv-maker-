/**
 * Gemini API client for the ATS Resume Builder
 */

/**
 * Refine Professional Summary
 */
export async function improveSummary(
  apiKey: string,
  summary: string,
  model: string = 'gemini-2.5-flash',
  isDemo: boolean = false
): Promise<string> {
  if (isDemo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Result-driven professional with hands-on experience as a ${summary.split(' ').slice(0, 3).join(' ') || 'Specialist'}. Adept at designing scalable solutions, driving efficiency, and collaborating across cross-functional teams. Proven track record of leveraging modern frameworks to optimize workflow productivity and deliver measurable business value.`);
      }, 1500);
    });
  }

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'improveSummary',
      summary,
      model,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API call failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.text;
}

/**
 * Refine Experience Bullet Points
 */
export async function improveBulletPoint(
  apiKey: string,
  description: string,
  model: string = 'gemini-2.5-flash',
  isDemo: boolean = false
): Promise<string> {
  if (isDemo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lines = description.split('\n').filter(line => line.trim().length > 0);
        const improved = lines.map(line => {
          const cleanLine = line.replace(/^[-\*\u2022]\s*/, '');
          const verbs = ['Spearheaded development of', 'Optimized architecture for', 'Orchestrated deployment of', 'Engineered critical features for', 'Redesigned core modules of'];
          const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
          return `- ${randomVerb} ${cleanLine}, resulting in a 25% improvement in load times and enhanced scalability.`;
        });
        resolve(improved.join('\n') || '- Spearheaded development of core software solutions, driving a 20% increase in user retention.');
      }, 1200);
    });
  }

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'improveBulletPoint',
      description,
      model,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API call failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.text;
}

/**
 * Tailor CV based on Job Description
 */
export async function tailorResume(
  apiKey: string,
  resumeData: any,
  jobDescription: string,
  model: string = 'gemini-2.5-flash',
  isDemo: boolean = false
): Promise<string> {
  if (isDemo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Extract words from JD to make it look tailored
        const jdWords = jobDescription.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const uniqueJdWords = [...new Set(jdWords)];
        const simulatedKeywords = ['scalability', 'agile', 'integration', 'performance tuning', 'cloud infrastructure', 'database optimization', 'cross-functional collaboration']
          .filter(word => jobDescription.toLowerCase().includes(word.toLowerCase()))
          .concat(uniqueJdWords.filter(w => ['react', 'node', 'python', 'aws', 'docker', 'typescript', 'javascript', 'postgres', 'sql', 'nosql', 'kubernetes', 'devops', 'cicd'].includes(w)))
          .slice(0, 6);

        if (simulatedKeywords.length === 0) {
          simulatedKeywords.push('Software Engineering', 'Technical Leadership', 'Problem Solving');
        }

        const formattedKeywords = simulatedKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ');

        resolve(`### AI ATS Analysis & Tailoring Recommendations

#### 🎯 Top Job Keywords Identified
- **Skills/Keywords**: ${formattedKeywords}

#### ✍️ Recommended Tailored Summary
"Highly motivated and result-driven professional offering a proven track record in ${simulatedKeywords[0] || 'software development'}. Expert in implementing best practices in ${simulatedKeywords.slice(0, 3).join(', ')}, with a focus on streamlining processes and enhancing system scalability. Collaborative leader adept at working in fast-paced environments to deliver critical business objectives."

#### 🛠️ Actionable Suggestions
1. **Experience Bullet Points**:
   - In your most recent role, add a bullet point showcasing your experience with **${simulatedKeywords[0] || 'scalable development'}** to align with the core requirements of this job.
   - Mention how you utilized **${simulatedKeywords[1] || 'modern best practices'}** to solve architectural challenges.
2. **Skills Section**:
   - Ensure the following skills are listed under your Technical Skills: **${formattedKeywords}**.
3. **Keyword Density**:
   - Increase the count of terms like **${simulatedKeywords[0] || 'development'}** and **${simulatedKeywords[1] || 'optimization'}** to match the high frequency found in the job description.`);
      }, 2000);
    });
  }

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'tailorResume',
      resumeData,
      jobDescription,
      model,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API call failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.text;
}
