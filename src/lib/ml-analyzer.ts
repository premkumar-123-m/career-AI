import { GoogleGenAI, Type, Schema } from '@google/genai';
import { analyzeResumeText } from './analyzer';

// Initialize the Gemini client. We use the official @google/genai SDK.
// It automatically picks up the GEMINI_API_KEY from process.env if available.
const ai = new GoogleGenAI({});

export async function analyzeResumeWithML(text: string) {
    // If no API key is provided, gracefully fallback to the local rule-based analyzer
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not found in environment variables. Falling back to rule-based analyzer.");
        return analyzeResumeText(text);
    }

    try {
        const prompt = `You are an expert technical recruiter and resume analyzer.
Please analyze the following resume text and extract the required information in a structured JSON format.

Resume Text:
"""
${text.substring(0, 5000)} // Truncating to avoid massive tokens if it's too long
"""

Instructions:
1. role: Infer the most likely job role (e.g., "Frontend Developer", "Data Scientist", "Full Stack Engineer").
2. score: Score the resume out of 100 based on impact, measurable metrics, and skill density.
3. feedback: Provide 2-3 sentences of constructive feedback on how to improve the resume.
4. skills: Extract a list of the 10 most relevant technical/hard skills found in the text. Capitalize them properly.
5. gaps: Based on the inferred role, identify 2-3 essential skills that are MISSING from the resume. For each gap, provide the skill name, a proficiency level ("Beginner"), progress (10), and category ("Essential").
6. jobTitles: Suggest 4 job titles the candidate should search and apply for based on their experience.

IMPORTANT: Ensure the response matches the JSON schema exactly.
`;

        const responseSchema: Schema = {
            type: Type.OBJECT,
            properties: {
                role: { type: Type.STRING },
                score: { type: Type.INTEGER },
                feedback: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                gaps: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            skill: { type: Type.STRING },
                            proficiency: { type: Type.STRING },
                            progress: { type: Type.INTEGER },
                            category: { type: Type.STRING }
                        },
                        required: ["skill", "proficiency", "progress", "category"]
                    }
                },
                jobTitles: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["role", "score", "feedback", "skills", "gaps", "jobTitles"]
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2
            }
        });

        if (!response.text) throw new Error("No text returned from Gemini");

        const data = JSON.parse(response.text);
        
        // Ensure the data conforms to our expected output format before returning
        return {
            role: data.role || "Software Engineer",
            score: typeof data.score === 'number' ? data.score : 60,
            feedback: data.feedback || "Good resume.",
            skills: Array.isArray(data.skills) ? data.skills : [],
            gaps: Array.isArray(data.gaps) ? data.gaps : [],
            jobTitles: Array.isArray(data.jobTitles) ? data.jobTitles : ["Software Engineer"]
        };

    } catch (error) {
        console.error("Error analyzing resume with Gemini API:", error);
        // Fallback to rule-based analyzer on API error
        console.warn("Falling back to rule-based analyzer due to API error.");
        return analyzeResumeText(text);
    }
}

export async function generateCoverLetter(resumeText: string, jobTitle: string, company: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
         return "Error: GEMINI_API_KEY is not set in environment variables. Please add it to your .env.local file to use the AI Cover Letter Generator.";
    }

    try {
        const prompt = `You are an expert career coach and copywriter.
Write a professional, compelling, and concise cover letter for the following position, using the candidate's resume text as context. 
Do not include brackets like [Your Name] or [Date] if the information is missing; instead, write it cleanly so it sounds natural without placeholders, or make reasonable generic assumptions.
Focus on how the candidate's skills from the resume make them a great fit for the role.

Target Job Title: ${jobTitle}
Target Company: ${company}

Candidate Resume Text:
"""
${resumeText.substring(0, 3000)}
"""

Keep the cover letter to 3-4 paragraphs. Make it modern and impactful, avoiding overly formal or archaic language like "Enclosed please find my resume".`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7
            }
        });

        return response.text || "Failed to generate cover letter.";

    } catch (error) {
        console.error("Error generating cover letter with Gemini API:", error);
        return "An error occurred while generating the cover letter. Please try again later.";
    }
}
