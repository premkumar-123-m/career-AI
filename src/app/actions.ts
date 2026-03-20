'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession, getSession, deleteSession } from '@/lib/auth'

import { revalidatePath } from 'next/cache'

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

        const fileName = file.name.toLowerCase();

        let contentToCheck = fileName;
        try {
            const buffer = await file.arrayBuffer();
            const textContent = Buffer.from(buffer).toString('utf-8').toLowerCase();
            contentToCheck += " " + textContent;
        } catch (e) {
            console.log("Could not read file buffer, relying on filename");
        }

        const session = await getSession();
        if (!session || !session.user) return { success: false, error: 'Unauthorized' };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) return { success: false, error: 'User not found' };

        // Determine profile based on file content/name or generic
        let role = "Software Engineer";
        let skills = ["React", "Node.js", "TypeScript", "Next.js"];
        let nextScore = 85;
        let jobTitle = "Frontend Developer";

        if (contentToCheck.includes("react") || contentToCheck.includes("frontend") || contentToCheck.includes("next.js")) {
            role = "Frontend Developer";
            skills = ["React", "Next.js", "Tailwind CSS", "TypeScript"];
            nextScore = 92;
            jobTitle = "Senior React Developer";
        } else if (contentToCheck.includes("backend") || contentToCheck.includes("node") || contentToCheck.includes("express")) {
            role = "Backend Developer";
            skills = ["Node.js", "Express", "PostgreSQL", "Docker"];
            nextScore = 88;
            jobTitle = "Backend Engineer";
        } else if (contentToCheck.includes("data") || contentToCheck.includes("python") || contentToCheck.includes("machine learning")) {
            role = "Data Scientist";
            skills = ["Python", "Machine Learning", "SQL", "Pandas"];
            nextScore = 90;
            jobTitle = "Data Analyst";
        } else if (contentToCheck.includes("designer") || contentToCheck.includes("ui") || contentToCheck.includes("figma")) {
            role = "UI/UX Designer";
            skills = ["Figma", "Adobe XD", "User Research", "Prototyping"];
            nextScore = 95;
            jobTitle = "Product Designer";
        } else {
            // Generic Fallback Improvements
            nextScore = 82;
            jobTitle = "Software Developer";
            role = "Software Developer";
        }

        // 1. Add new Resume Score
        await prisma.resumeScore.create({
            data: {
                userId: user.id,
                score: nextScore,
                feedback: `Great resume for a ${role} position. Consider adding more quantifiable metrics to your recent experiences.`
            }
        });

        // 2. Add New Job Matches
        // Clear old ones first to make it obvious
        await prisma.jobMatch.deleteMany({ where: { userId: user.id } });

        await prisma.jobMatch.createMany({
            data: [
                { userId: user.id, title: jobTitle, company: "TechNova (AI Matched)", matchPercentage: 95, type: "Full-Time" },
                { userId: user.id, title: role, company: "Innovate AI (AI Matched)", matchPercentage: 88, type: "Remote" },
                { userId: user.id, title: `Junior ${role}`, company: "StartupX (AI Matched)", matchPercentage: 100, type: "Hybrid" }
            ]
        });

        // 3. Add New Skill Gaps
        await prisma.skillGap.deleteMany({ where: { userId: user.id } });
        await prisma.skillGap.createMany({
            data: [
                { userId: user.id, skill: "GraphQL", proficiency: "Beginner", progress: 20, category: "API" },
                { userId: user.id, skill: "AWS", proficiency: "Intermediate", progress: 50, category: "Cloud" }
            ]
        });

        // 4. Add New Mock Interview
        await prisma.mockInterview.create({
            data: {
                userId: user.id,
                role: role,
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
                    resumeData: JSON.stringify({ skills: skills, highlight: `${role} Portfolio from Resume`, jobs: [jobTitle, role] })
                }
            });
        }

        // Revalidate the dashboard paths
        revalidatePath('/dashboard', 'layout');

        return { success: true, message: 'Resume Analyzed!' };

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
    } catch (e) {
        console.error("Register error:", e);
        return { success: false, error: 'Registration failed' };
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
    } catch (e) {
        console.error("Login error:", e);
        return { success: false, error: 'Login failed' };
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
