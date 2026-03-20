const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    // Check if the user already exists
    let user = await prisma.user.findUnique({
        where: { email: 'student@example.com' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'student@example.com',
                password: hashedPassword,
                role: 'Student'
            }
        });
        console.log('Created User:', user.id);
    } else {
        // Update password if user exists to ensure we can login
        user = await prisma.user.update({
            where: { email: 'student@example.com' },
            data: { password: hashedPassword }
        });
        console.log('User password updated:', user.id);
    }

    // Clear existing data for this user to avoid duplicates on re-seeds
    await prisma.resumeScore.deleteMany({ where: { userId: user.id } });
    await prisma.jobMatch.deleteMany({ where: { userId: user.id } });
    await prisma.skillGap.deleteMany({ where: { userId: user.id } });
    await prisma.mockInterview.deleteMany({ where: { userId: user.id } });
    await prisma.portfolio.deleteMany({ where: { userId: user.id } });

    // Seed Resume Score
    await prisma.resumeScore.create({
        data: {
            userId: user.id,
            score: 85,
            feedback: "Your resume is strong in React, but lacks quantifiable achievements in your project descriptions."
        }
    });

    // Seed Job Matches
    await prisma.jobMatch.createMany({
        data: [
            { userId: user.id, title: 'Frontend Developer', company: 'TechCorp', matchPercentage: 92, type: 'Full-Time', status: 'Recommended' },
            { userId: user.id, title: 'React Engineer Intern', company: 'StartupX', matchPercentage: 88, type: 'Internship', status: 'Recommended' },
            { userId: user.id, title: 'Junior Web Developer', company: 'CreativeAgency', matchPercentage: 75, type: 'Full-Time', status: 'Applied' }
        ]
    });

    // Seed Skill Gaps
    await prisma.skillGap.createMany({
        data: [
            { userId: user.id, skill: 'TypeScript', proficiency: 'Intermediate', progress: 40, category: 'Frontend' },
            { userId: user.id, skill: 'State Management (Zustand)', proficiency: 'Beginner', progress: 20, category: 'Frontend' },
            { userId: user.id, skill: 'Node.js', proficiency: 'Beginner', progress: 10, category: 'Backend' }
        ]
    });

    // Seed Mock Interviews
    await prisma.mockInterview.createMany({
        data: [
            { userId: user.id, role: 'Frontend Junior', difficulty: 'Mid Level', score: 82, feedback: 'Strong React fundamentals, need to review uncontrolled components.' },
            { userId: user.id, role: 'Behavioral Screen', difficulty: 'Behavioral Only', score: 95, feedback: 'Excellent communication and STAR method usage.' }
        ]
    });

    // Seed Portfolio Configuration
    await prisma.portfolio.create({
        data: {
            userId: user.id,
            theme: 'Minimalist',
            color: '#6366f1',
            sections: 'About Me,Skills Graphic,Projects Sandbox,Experience'
        }
    });

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
