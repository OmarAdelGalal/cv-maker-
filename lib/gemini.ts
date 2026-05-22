/**
 * Gemini API client for the ATS Resume Builder
 */

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Sends a prompt to the Gemini API
 */
async function callGemini(apiKey: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const url = `${API_BASE_URL}/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nUser Input:\n${userPrompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API call failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  return text;
}

/**
 * Refine Professional Summary
 */
export async function improveSummary(
  apiKey: string,
  summary: string,
  model: string = 'gemini-2.5-flash',
  isDemo: boolean = false
): Promise<string> {
  if (isDemo || !apiKey) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Result-driven professional with hands-on experience as a ${summary.split(' ').slice(0, 3).join(' ') || 'Specialist'}. Adept at designing scalable solutions, driving efficiency, and collaborating across cross-functional teams. Proven track record of leveraging modern frameworks to optimize workflow productivity and deliver measurable business value.`);
      }, 1500);
    });
  }

  const systemPrompt = `You are a professional resume writer and ATS optimization specialist.
Rewrite the user's professional summary to be concise, impactful, and rich in industry-relevant keywords.
Guidelines:
1. Start with a strong professional title (e.g., "Result-driven Senior Software Engineer...").
2. Highlight core expertise and key achievements.
3. Do not use generic buzzwords or cliché phrases.
4. Keep it under 4 sentences or ~70 words.
5. Return ONLY the rewritten summary, without any introductory or concluding text, explanations, or quotes.`;

  return callGemini(apiKey, model, systemPrompt, summary);
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
  if (isDemo || !apiKey) {
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

  const systemPrompt = `You are an ATS resume optimization writer.
Optimize the following job experience description bullet points to be action-verb and achievement-oriented.
Guidelines:
1. Each bullet point MUST start with a strong action verb (e.g., Spearheaded, Orchestrated, Designed, Engineered, Formulated).
2. Focus on the impact and result of the action (use metrics, percentages, or concrete values where possible).
3. Do not use passive voice (e.g., "Responsible for...").
4. Keep bullet points concise and professional.
5. Format the output with clear bullet points (using '-' or '*').
6. Return ONLY the polished bullet points, without introductory or concluding text.`;

  return callGemini(apiKey, model, systemPrompt, description);
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
  if (isDemo || !apiKey) {
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

  const systemPrompt = `You are an expert ATS Resume Recruiter and Optimizer.
Analyze the user's resume details and the target Job Description to identify keyword gaps and suggest tailoring improvements.
Format your output in clean Markdown.

Input details:
Resume: ${JSON.stringify(resumeData)}

Guidelines:
1. Identify the top 5-10 essential keywords and technical skills requested in the Job Description.
2. Review the user's resume data and see if those keywords are missing or underutilized.
3. Provide a tailored Professional Summary designed to catch the recruiter's eye and match the ATS keyword filters.
4. List specific, actionable modifications:
   - Which skills to add to the Skills list.
   - How to tweak work experience bullet points to integrate the missing keywords naturally.
5. Do NOT write full HTML. Return clean, formatted Markdown.`;

  return callGemini(apiKey, model, systemPrompt, jobDescription);
}
