'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession, getSession, deleteSession } from '@/lib/auth'

import { revalidatePath } from 'next/cache'
import { analyzeResumeWithML, generateCoverLetter } from '@/lib/ml-analyzer'

async function fetchRealJobs(jobTitle: string) {
    try {
        const res = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(jobTitle)}&limit=4`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.jobs || [];
    } catch (e) {
        console.error("Failed to fetch jobs from Remotive API", e);
        return [];
    }
}
export async function getUserProfile() {
    try {
        const session = await getSession();
        if (!session || !session.user) return null;

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                resumeScores: { orderBy: { createdAt: 'desc' }, take: 1 },
                jobMatches: { orderBy: { createdAt: 'desc' } },
                skillGaps: true,
                mockInterviews: { orderBy: { createdAt: 'desc' } },
                portfolios: { orderBy: { createdAt: 'desc' }, take: 1 }
            }
        });

        if (!user) return null;

        const dbScore = user.resumeScores[0] || null;
        const mappedScore = dbScore ? {
            ...dbScore,
            overallScore: dbScore.score,
            impactScore: Math.min(100, dbScore.score + 15),
            quantifiableScore: Math.max(0, dbScore.score - 20),
            formattingScore: 100
        } : null;

        return {
            ...user,
            resumeScore: mappedScore,
            interviews: user.mockInterviews,
            portfolios: user.portfolios
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export async function getDashboardStats() {
    const user = await getUserProfile();
    if (!user) return null;

    const resumeScore = user.resumeScores[0]?.score || 0;
    const matchedJobsCount = user.jobMatches.length;
    const skillGapsCount = user.skillGaps.length;

    return {
        resumeScore,
        matchedJobsCount,
        skillGapsCount,
        user
    }
}

export async function analyzeUploadedResume(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) return { success: false, error: 'No file provided' };

        const session = await getSession();
        if (!session || !session.user) return { success: false, error: 'Unauthorized' };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) return { success: false, error: 'User not found' };

        let textContent = "";
        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                // Polyfill for pdf-parse in Node 20+
                if (typeof global.DOMMatrix === 'undefined') {
                    (global as any).DOMMatrix = class DOMMatrix { };
                }
                const pdfParse = require('pdf-parse');
                const pdfData = await pdfParse(buffer);
                textContent = pdfData.text;
            } else {
                // Fallback for txt/md files
                textContent = buffer.toString('utf-8');
            }
        } catch (e) {
            console.error("Failed to parse file buffer:", e);
            return { success: false, error: 'Failed to read the file contents.' };
        }

        // Analyze using the new ML engine (falls back to rule-based if no API key)
        const analysis = await analyzeResumeWithML(textContent);

        // 1. Add new Resume Score
        await prisma.resumeScore.create({
            data: {
                userId: user.id,
                score: analysis.score,
                feedback: analysis.feedback
            }
        });

        // 2. Add New Job Matches
        await prisma.jobMatch.deleteMany({ where: { userId: user.id } });
        
        // Fetch real jobs from Remotive API based on the primary suggested title
        const primaryTitle = analysis.jobTitles[0] || analysis.role;
        let realJobs = await fetchRealJobs(primaryTitle);
        
        let jobMatchesData = [];

        if (realJobs && realJobs.length > 0) {
            jobMatchesData = realJobs.slice(0, 4).map((job: any) => ({
                userId: user.id,
                title: job.title || primaryTitle,
                company: job.company_name || "Unknown Company",
                matchPercentage: Math.floor(Math.random() * (98 - 85 + 1) + 85), // Simulate a high match %
                type: (job.job_type || "Remote").replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
            }));
        } else {
            // Fallback to mock generation if the API fails or returns no jobs
            jobMatchesData = analysis.jobTitles.map((title, idx) => ({
                userId: user.id,
                title: title,
                company: ["TechNova", "Innovate AI", "StartupX", "Global Systems"][idx % 4] + " (AI Matched)",
                matchPercentage: 95 - (idx * 5),
                type: ["Full-Time", "Remote", "Hybrid", "Contract"][idx % 4]
            }));
        }

        if (jobMatchesData.length > 0) {
            await prisma.jobMatch.createMany({ data: jobMatchesData });
        }

        // 3. Add New Skill Gaps
        await prisma.skillGap.deleteMany({ where: { userId: user.id } });
        if (analysis.gaps.length > 0) {
            await prisma.skillGap.createMany({
                data: analysis.gaps.map(g => ({
                    userId: user.id,
                    skill: g.skill,
                    proficiency: g.proficiency,
                    progress: g.progress,
                    category: g.category
                }))
            });
        }

        // 4. Add New Mock Interview
        await prisma.mockInterview.create({
            data: {
                userId: user.id,
                role: analysis.role,
                difficulty: "Medium",
                score: null,
                feedback: null
            }
        });

        // 5. Update Portfolio Section based on skills
        const portfolio = await prisma.portfolio.findFirst({ where: { userId: user.id } });
        if (portfolio) {
            await prisma.portfolio.update({
                where: { id: portfolio.id },
                data: {
                    resumeData: JSON.stringify({ 
                        skills: analysis.skills, 
                        highlight: `${analysis.role} Portfolio from Resume`, 
                        jobs: analysis.jobTitles.slice(0, 2),
                        rawText: textContent.substring(0, 2500) // Store subset of text for cover letters
                    })
                }
            });
        }

        // Revalidate the dashboard paths
        revalidatePath('/dashboard', 'layout');

        return { success: true, message: 'Resume Analyzed Successfully!' };

    } catch (error) {
        console.error("Error analyzing resume:", error);
        return { success: false, error: 'Failed to analyze resume' };
    }
}

export async function updateUserProfile(id: string, name: string, role: string) {
    try {
        await prisma.user.update({
            where: { id },
            data: { name, role }
        });
        revalidatePath('/dashboard', 'layout');
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: 'Failed to update profile' };
    }
}

export async function registerUser(formData: FormData) {
    try {
        const name = formData.get('name')?.toString() || '';
        const email = formData.get('email')?.toString().toLowerCase() || '';
        const password = formData.get('password')?.toString() || '';
        const role = formData.get('role')?.toString() || 'Student';

        if (!name || !email || !password) {
            return { success: false, error: 'Missing required fields' };
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return { success: false, error: 'User already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        });

        // Seed basic initial data to provide a good first experience
        await prisma.portfolio.create({
            data: {
                userId: user.id,
                theme: 'Minimalist',
                color: '#6366f1',
                sections: 'About Me,Experience'
            }
        });

        await createSession(user.id);

        return { success: true };
    } catch (e: any) {
        console.error("Register error:", e);
        return { success: false, error: `Registration failed: ${e.message || String(e)}` };
    }
}

export async function loginUser(formData: FormData) {
    try {
        const email = formData.get('email')?.toString().toLowerCase() || '';
        const password = formData.get('password')?.toString() || '';

        if (!email || !password) {
            return { success: false, error: 'Missing required fields' };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { success: false, error: 'User not found. Check if your email has a typo.' };
        }
        if (!user.password) {
            return { success: false, error: 'User has no password set' };
        }

        const pwMatch = await bcrypt.compare(password, user.password);
        if (!pwMatch) {
            return { success: false, error: 'Incorrect password' };
        }

        await createSession(user.id);

        return { success: true };
    } catch (e: any) {
        console.error("Login error:", e);
        return { success: false, error: `Login failed: ${e.message || String(e)}` };
    }
}

export async function logoutUser() {
    await deleteSession();
    return { success: true };
}

export async function applyForJob(jobId: string) {
    try {
        const session = await getSession();
        if (!session || !session.user) return { success: false, error: 'Unauthorized' };

        await prisma.jobMatch.update({
            where: { id: jobId, userId: session.user.id },
            data: { status: 'Applied' }
        });

        revalidatePath('/dashboard', 'layout');
        return { success: true };
    } catch (error) {
        console.error("Error applying for job:", error);
        return { success: false, error: 'Failed to apply' };
    }
}

export async function generateCoverLetterAction(jobTitle: string, company: string) {
    try {
        const session = await getSession();
        if (!session || !session.user) return { success: false, error: 'Unauthorized' };

        // Fetch user's portfolio to get the saved resume text
        const portfolio = await prisma.portfolio.findFirst({
            where: { userId: session.user.id }
        });

        if (!portfolio || !portfolio.resumeData) {
            return { success: false, error: 'Please upload a resume first.' };
        }

        const parsedData = JSON.parse(portfolio.resumeData);
        const resumeText = parsedData.rawText || parsedData.skills?.join(', ') || "No resume text found.";

        const coverLetter = await generateCoverLetter(resumeText, jobTitle, company);
        
        return { success: true, coverLetter };
    } catch (error: any) {
        console.error("Error generating cover letter:", error);
        return { success: false, error: error.message || 'Failed to generate cover letter.' };
    }
}
