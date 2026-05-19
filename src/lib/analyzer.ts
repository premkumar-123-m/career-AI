// src/lib/analyzer.ts

// A robust dictionary of tech skills and keywords
const SKILL_DICTIONARY = {
    Frontend: ["react", "next.js", "vue", "angular", "html", "css", "javascript", "typescript", "tailwind", "sass", "redux", "webpack", "babel"],
    Backend: ["node.js", "express", "python", "django", "flask", "java", "spring boot", "c#", ".net", "ruby", "rails", "php", "laravel", "go", "rust"],
    Database: ["sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb", "firebase"],
    CloudDevOps: ["aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "github actions", "gitlab ci", "terraform", "linux"],
    DataScience: ["machine learning", "deep learning", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "data analysis", "sql", "r"],
    Design: ["figma", "adobe xd", "sketch", "photoshop", "illustrator", "ui design", "ux design", "user research", "wireframing", "prototyping"]
};

// Roles and their required skills
const ROLE_DEFINITIONS = {
    "Frontend Developer": {
        keywords: ["frontend", "front end", "react", "ui", "web developer"],
        essentialSkills: ["react", "javascript", "html", "css"],
        titles: ["Frontend Developer", "React Engineer", "UI Developer"]
    },
    "Backend Developer": {
        keywords: ["backend", "back end", "node", "java", "api", "database"],
        essentialSkills: ["node.js", "sql", "api design"],
        titles: ["Backend Developer", "Software Engineer (Backend)", "API Engineer"]
    },
    "Full Stack Developer": {
        keywords: ["full stack", "fullstack", "mern", "mean"],
        essentialSkills: ["react", "node.js", "sql", "javascript"],
        titles: ["Full Stack Developer", "Software Engineer", "MERN Stack Developer"]
    },
    "Data Scientist": {
        keywords: ["data", "machine learning", "ai", "analytics"],
        essentialSkills: ["python", "sql", "machine learning"],
        titles: ["Data Scientist", "Data Analyst", "Machine Learning Engineer"]
    },
    "UI/UX Designer": {
        keywords: ["designer", "ui", "ux", "figma"],
        essentialSkills: ["figma", "ui design", "ux design"],
        titles: ["Product Designer", "UI/UX Designer", "UX Researcher"]
    }
};

export function analyzeResumeText(text: string) {
    const normalizedText = text.toLowerCase();
    
    // 1. Extract Skills
    const extractedSkills = new Set<string>();
    const skillCategories = new Set<string>();
    
    for (const [category, skills] of Object.entries(SKILL_DICTIONARY)) {
        for (const skill of skills) {
            // Use word boundary regex for accurate matching (e.g. matching "react" but not "reactor")
            // Escape special chars like . in node.js
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
            if (regex.test(normalizedText)) {
                extractedSkills.add(skill);
                skillCategories.add(category);
            }
        }
    }

    // 2. Infer Role based on keyword frequency
    let inferredRole = "Software Developer";
    let maxMatches = 0;
    
    for (const [roleName, data] of Object.entries(ROLE_DEFINITIONS)) {
        let matches = 0;
        data.keywords.forEach(kw => {
            const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
            const found = normalizedText.match(regex);
            if (found) matches += found.length;
        });
        
        // Also boost if they have essential skills for this role
        data.essentialSkills.forEach(skill => {
            if (extractedSkills.has(skill)) matches += 2;
        });

        if (matches > maxMatches) {
            maxMatches = matches;
            inferredRole = roleName;
        }
    }

    // 3. Compute Score
    let score = 50; // base score
    let feedbackNotes = [];

    // Length check
    if (normalizedText.length > 1000) score += 10;
    else feedbackNotes.push("Your resume is quite brief. Consider adding more detail to your experience.");

    // Skill density
    if (extractedSkills.size > 15) score += 15;
    else if (extractedSkills.size > 8) score += 10;
    else {
        score += 5;
        feedbackNotes.push("We didn't detect many hard skills. Ensure you list all your technical tools explicitly.");
    }

    // Quantitative metrics (numbers, %, $)
    if (/[0-9]+%/.test(normalizedText) || /\\$[0-9]+/.test(normalizedText)) {
        score += 15;
        feedbackNotes.push("Great job using quantitative metrics (like % or $) to highlight your impact.");
    } else {
        feedbackNotes.push("Consider adding more quantifiable metrics (e.g., 'Improved performance by 20%') to make your achievements stand out.");
    }

    // Action verbs
    const actionVerbs = ['developed', 'led', 'designed', 'optimized', 'managed', 'created', 'implemented', 'reduced', 'increased'];
    let verbsFound = 0;
    actionVerbs.forEach(verb => {
        if (new RegExp(`\\b${verb}\\b`, 'i').test(normalizedText)) verbsFound++;
    });
    
    if (verbsFound > 4) {
        score += 10;
    } else {
        feedbackNotes.push("Use more strong action verbs (e.g., Developed, Optimized, Led) to start your bullet points.");
    }

    // Normalize score
    score = Math.min(Math.max(score, 0), 100);

    // 4. Determine Skill Gaps
    const gaps: { skill: string, proficiency: string, progress: number, category: string }[] = [];
    const roleData = ROLE_DEFINITIONS[inferredRole as keyof typeof ROLE_DEFINITIONS] || ROLE_DEFINITIONS["Full Stack Developer"];
    
    roleData.essentialSkills.forEach(essentialSkill => {
        if (!extractedSkills.has(essentialSkill)) {
            gaps.push({
                skill: essentialSkill.charAt(0).toUpperCase() + essentialSkill.slice(1),
                proficiency: "Beginner",
                progress: 10,
                category: "Essential"
            });
        }
    });

    // Generate accurate job recommendations
    const jobTitles = roleData.titles;

    return {
        role: inferredRole,
        score,
        feedback: feedbackNotes.join(" ") || `Great resume for a ${inferredRole} position.`,
        skills: Array.from(extractedSkills).map(s => s.charAt(0).toUpperCase() + s.slice(1)), // Capitalize
        gaps,
        jobTitles
    };
}
