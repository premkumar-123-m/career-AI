'use client'

import { useState } from 'react';

const SOFTWARE_ROLES = [
    "Frontend Developer (React/Vue/Angular)",
    "Backend Developer (Node.js/Python/Java)",
    "Full-Stack Engineer",
    "Mobile Developer (iOS/Android/React Native)",
    "DevOps Engineer",
    "Cloud Architect (AWS/Azure/GCP)",
    "Data Scientist",
    "Machine Learning Engineer",
    "UI/UX Designer",
    "Product Manager",
    "QA Engineer / SDET",
    "Security Engineer",
    "Database Administrator"
];

const DIFFICULTY_LEVELS = [
    "Junior / Entry Level",
    "Mid Level",
    "Senior Level",
    "Behavioral Only",
    "System Design"
];

// Helper to generate mock questions based on role
const generateQuestions = (role: string, difficulty: string) => {
    let questions = [];
    
    // Base behavioral question
    questions.push({
        type: 'Behavioral',
        text: `Tell me about a time you had to handle a critical bug in a ${role.split(' ')[0]} project under a tight deadline.`
    });

    if (role.toLowerCase().includes('frontend') || role.toLowerCase().includes('react')) {
        questions.push(
            { type: 'Technical • React.js', text: 'Can you explain the difference between a controlled and an uncontrolled component in React? When would you use one over the other?' },
            { type: 'Technical • Performance', text: 'What strategies would you use to optimize the load time of a heavy web application?' },
            { type: 'Technical • JavaScript', text: 'Explain the concept of closures in JavaScript and provide a practical use case.' },
            { type: 'Technical • CSS', text: 'How do you handle responsive design without relying entirely on CSS frameworks like Tailwind or Bootstrap?' }
        );
    } else if (role.toLowerCase().includes('backend') || role.toLowerCase().includes('node')) {
        questions.push(
            { type: 'Technical • Node.js', text: 'How does the Event Loop work in Node.js, and how does it handle asynchronous operations?' },
            { type: 'Technical • Databases', text: 'What is the difference between SQL and NoSQL databases? When would you choose one over the other?' },
            { type: 'Technical • Architecture', text: 'Explain how you would implement caching in a high-traffic RESTful API.' },
            { type: 'Technical • Security', text: 'What are the most common vulnerabilities in a web API (e.g., OWASP top 10), and how do you prevent them?' }
        );
    } else if (role.toLowerCase().includes('data') || role.toLowerCase().includes('machine learning')) {
        questions.push(
            { type: 'Technical • Algorithms', text: 'Explain the difference between supervised and unsupervised learning.' },
            { type: 'Technical • Data Processing', text: 'How do you handle missing or corrupted data in a large dataset?' },
            { type: 'Technical • Modeling', text: 'What is overfitting in machine learning, and what techniques can you use to prevent it?' },
            { type: 'Technical • Python', text: 'Describe the differences between lists and tuples in Python. When would you use a tuple over a list?' }
        );
    } else {
        // Generic fallback
        questions.push(
            { type: 'Technical • Algorithms', text: 'Explain the time complexity of the quicksort algorithm in the best, average, and worst-case scenarios.' },
            { type: 'System Design', text: `How would you design a scalable architecture for a typical ${role.split(' ')[0]} application?` },
            { type: 'Technical • API', text: 'What are the key principles of REST API design?' },
            { type: 'Behavioral', text: 'Describe a time when you disagreed with a senior team member about a technical decision. How did you resolve it?' }
        );
    }

    if (difficulty === 'Senior Level' || difficulty === 'System Design') {
        questions[2] = { type: 'System Design', text: 'Design a system like Twitter. What database would you choose, and how would you handle the feed generation at scale?' };
    }

    return questions;
};

export default function InterviewClient({ targetRole, initialInterviews }: { targetRole: string, initialInterviews: any[] }) {
    const [selectedRole, setSelectedRole] = useState(targetRole);
    const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS[0]);
    
    // Session State
    const [isGenerating, setIsGenerating] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    // Initial role verification
    const defaultRole = SOFTWARE_ROLES.find(r => r.includes(targetRole.split(' ')[0])) || SOFTWARE_ROLES[0];
    
    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setQuestions(generateQuestions(selectedRole, difficulty));
            setSessionStarted(true);
            setCurrentIdx(0);
            setIsGenerating(false);
            setFeedback(null);
            setShowHint(false);
        }, 1500);
    };

    const handleRecord = () => {
        if (isRecording) {
            // Stop recording & simulate processing feedback
            setIsRecording(false);
            setFeedback("Analyzing your response...");
            setTimeout(() => {
                setFeedback(`Great attempt! You covered the basics well. For a ${difficulty} role, try to expand slightly more on edge cases and provide a brief real-world example.`);
            }, 2000);
        } else {
            // Start recording
            setFeedback(null);
            setIsRecording(true);
        }
    };

    const nextQuestion = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setFeedback(null);
            setShowHint(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
            
            {/* Main Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Setup Card */}
                <div className="glass-panel setup-card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Start a New Session</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Select the role and difficulty level to generate AI questions.</p>

                    <div className="select-group">
                        <select 
                            className="select-input" 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {!SOFTWARE_ROLES.includes(targetRole) && <option value={targetRole}>{targetRole}</option>}
                            {SOFTWARE_ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        
                        <select 
                            className="select-input"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            {DIFFICULTY_LEVELS.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                        
                        <button 
                            className="btn-primary" 
                            style={{ padding: '0.75rem 2rem', opacity: isGenerating ? 0.7 : 1 }}
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Questions'}
                        </button>
                    </div>
                </div>

                {/* Practice Area */}
                {sessionStarted ? (
                    <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            <span>Question {currentIdx + 1} of {questions.length}</span>
                            <span style={{ color: 'var(--brand-primary)' }}>{questions[currentIdx].type}</span>
                        </div>

                        <div className="question-card">
                            <h3 style={{ fontSize: '1.5rem', lineHeight: 1.4, marginBottom: '1rem' }}>
                                "{questions[currentIdx].text}"
                            </h3>
                            <button 
                                className="btn-secondary" 
                                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                onClick={() => setShowHint(!showHint)}    
                            >
                                💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                            </button>
                            {showHint && (
                                <p style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Structure your answer using the STAR method (Situation, Task, Action, Result) for behavioral questions, or highlight trade-offs if it's technical.
                                </p>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="timer">{isRecording ? '...Listening...' : '00:00'}</div>
                            
                            <div 
                                className="record-btn" 
                                style={{
                                    animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                                    background: isRecording ? '#ef4444' : 'rgba(239, 68, 68, 0.1)',
                                    color: isRecording ? 'white' : '#ef4444'
                                }}
                                onClick={handleRecord}
                            >
                                <span>{isRecording ? '⏹' : '🎤'}</span>
                            </div>
                            
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {isRecording ? 'Click to stop recording' : 'Click to start recording your answer'}
                            </p>
                            
                            <style dangerouslySetInnerHTML={{__html: `
                                @keyframes pulse {
                                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                                    70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
                                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                                }
                            `}} />
                        </div>

                        {/* Feedback UI */}
                        {feedback && (
                            <div className="feedback-box animate-fade-up" style={{ marginTop: '2rem' }}>
                                <h4 style={{ color: 'var(--brand-accent)', marginBottom: '0.5rem' }}>✨ AI Instant Feedback (Mock)</h4>
                                <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{feedback}</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button 
                                className="btn-primary" 
                                onClick={nextQuestion}
                                disabled={currentIdx === questions.length - 1}
                                style={{ opacity: currentIdx === questions.length - 1 ? 0.5 : 1 }}
                            >
                                Next Question
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎙️</div>
                        <h3 style={{ color: 'var(--text-secondary)' }}>Select your preferences and generate questions to start practicing.</h3>
                    </div>
                )}
            </div>

            {/* Previous Sessions */}
            <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Past Sessions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {initialInterviews.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No past sessions found.</p>
                    ) : (
                        initialInterviews.map((interview: any) => (
                            <div key={interview.id} style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>{interview.role}</span>
                                    <span style={{ color: 'var(--brand-accent)', fontWeight: 'bold' }}>{interview.score}/100</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {new Date(interview.createdAt).toLocaleDateString()} • {interview.questions || 5} Questions
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
