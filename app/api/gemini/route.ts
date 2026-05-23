import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function POST(request: Request) {
  try {
    const { action, summary, description, resumeData, jobDescription, model = 'gemini-2.5-flash' } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured on the server.' }, { status: 500 });
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'improveSummary') {
      systemPrompt = `You are a professional resume writer and ATS optimization specialist.
Rewrite the user's professional summary to be concise, impactful, and rich in industry-relevant keywords.
Guidelines:
1. Start with a strong professional title (e.g., "Result-driven Senior Software Engineer...").
2. Highlight core expertise and key achievements.
3. Do not use generic buzzwords or cliché phrases.
4. Keep it under 4 sentences or ~70 words.
5. Return ONLY the rewritten summary, without any introductory or concluding text, explanations, or quotes.`;
      userPrompt = summary;
    } else if (action === 'improveBulletPoint') {
      systemPrompt = `You are an ATS resume optimization writer.
Optimize the following job experience description bullet points to be action-verb and achievement-oriented.
Guidelines:
1. Each bullet point MUST start with a strong action verb (e.g., Spearheaded, Orchestrated, Designed, Engineered, Formulated).
2. Focus on the impact and result of the action (use metrics, percentages, or concrete values where possible).
3. Do not use passive voice (e.g., "Responsible for...").
4. Keep bullet points concise and professional.
5. Format the output with clear bullet points (using '-' or '*').
6. Return ONLY the polished bullet points, without introductory or concluding text.`;
      userPrompt = description;
    } else if (action === 'tailorResume') {
      systemPrompt = `You are an expert ATS Resume Recruiter and Optimizer.
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
      userPrompt = jobDescription;
    } else {
      return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
    }

    const url = `${API_BASE_URL}/${model}:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(url, {
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

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || `API call failed with status ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: 'Empty response from Gemini API' }, { status: 500 });
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Error in secure gemini route handler:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
