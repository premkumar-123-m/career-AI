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

    if (role.toLowerCase().includes('frontend') || role.toLowerCase().includes('react')) {
        questions.push(
            {
                type: 'Technical • React.js',
                text: 'What is the primary difference between a controlled and an uncontrolled component in React?',
                options: [
                    'Controlled components rely on state hooks while uncontrolled components use context.',
                    'Controlled components delegate state management to parent components, whereas uncontrolled components keep their own state internally and are typically accessed via refs.',
                    'Controlled components manage their own state internally, while uncontrolled components are fully stateless.',
                    'Uncontrolled components are strictly used for class components, while controlled components are for functional components.'
                ],
                correctAnswer: 1
            },
            {
                type: 'Technical • Performance',
                text: 'Which strategy is NOT considered a best practice for optimizing the load time of a heavy web application?',
                options: [
                    'Code splitting and lazy loading of components.',
                    'Minifying and compressing static assets.',
                    'Executing all JavaScript synchronously in the <head> element.',
                    'Utilizing a Content Delivery Network (CDN) to serve assets.'
                ],
                correctAnswer: 2
            },
            {
                type: 'Technical • JavaScript',
                text: 'Which statement accurately describes a closure in JavaScript?',
                options: [
                    'A closure is a function bundled together with references to its lexically surrounding state.',
                    'A closure is an immediately invoked function expression (IIFE).',
                    'A closure is a syntax that strictly handles asynchronous API requests.',
                    'A closure is a built-in method of the Array prototype for mapping values.'
                ],
                correctAnswer: 0
            },
            {
                type: 'Technical • CSS',
                text: 'How do you handle responsive design without relying entirely on CSS frameworks like Tailwind or Bootstrap?',
                options: [
                    'By utilizing standard CSS media queries (@media), relative units (%, vw, vh), and modern layout modules like Flexbox and CSS Grid.',
                    'By overriding the browser defaults using JavaScript window.resize event listeners to continuously recalculate and apply inline styles.',
                    'By duplicating the entire HTML structure for different screen sizes and hiding them using display: none.',
                    'By heavily relying on fixed dimension constraints strictly in pixels for all structural components ensuring pixel-perfect static rendering.'
                ],
                correctAnswer: 0
            }
        );
    } else if (role.toLowerCase().includes('backend') || role.toLowerCase().includes('node')) {
        questions.push(
            {
                type: 'Technical • Node.js',
                text: 'How does Node.js achieve non-blocking operations despite being single-threaded?',
                options: [
                    'By spawning a separate process for each incoming request.',
                    'By interpreting multiple JavaScript execution threads simultaneously.',
                    'By offloading asynchronous blocking operations to the system kernel via the Event Loop.',
                    'By prioritizing CPU-bound processes before executing I/O bound callbacks.'
                ],
                correctAnswer: 2
            },
            {
                type: 'Technical • Databases',
                text: 'In which scenario is a NoSQL database generally preferred over a relational (SQL) database?',
                options: [
                    'When strict ACID compliance and complex transactions are paramount.',
                    'When the application depends on highly structured tabular data with rigid relationships.',
                    'When the system requires seamless horizontal scalability and accommodates flexible or fluid data schemas.',
                    'When data consistency is strictly prioritized above partition tolerance and availability.'
                ],
                correctAnswer: 2
            },
            {
                type: 'Technical • Architecture',
                text: 'Where is the optimal layer to implement caching for read-heavy API responses in a highly scaled architecture?',
                options: [
                    'Exclusively on the client-side using localStorage.',
                    'Within the database layer by adding complex table indices.',
                    'In an intermediate datastore like Redis or Memcached between the API cluster and the database.',
                    'Caching mechanisms should be avoided as they inherently compromise data integrity.'
                ],
                correctAnswer: 2
            },
            {
                type: 'Technical • Security',
                text: 'Which definition best outlines a SQL Injection vulnerability?',
                options: [
                    'Exploiting vulnerabilities in SSL/TLS protocols to read unencrypted traffic.',
                    'Embedding malicious JavaScript to execute natively within the client browser.',
                    'Overloading the application with fraudulent network packets to cause a denial of service.',
                    'Manipulating input parameters to force the server backend into executing unauthorized SQL queries.'
                ],
                correctAnswer: 3
            }
        );
    } else if (role.toLowerCase().includes('data') || role.toLowerCase().includes('machine learning')) {
        questions.push(
            {
                type: 'Technical • Algorithms',
                text: 'What is the principal difference between supervised and unsupervised learning approaches?',
                options: [
                    'Supervised models explicitly utilize labeled training data, whereas unsupervised models infer patterns from unlabeled data.',
                    'Supervised learning exclusively manages classification tasks, while unsupervised learning focuses solely on regression.',
                    'Supervised models always demand less computational overhead to train than unsupervised models.',
                    'Unsupervised models inherently require manual guidance during the gradient descent iterations.'
                ],
                correctAnswer: 0
            },
            {
                type: 'Technical • Data Processing',
                text: 'When faced with significant missing variables in a vast dataset, what action is predominantly viewed as detrimental without proper context?',
                options: [
                    'Infilling missing records with the dataset median or modal value.',
                    'Leveraging predictive statistical models (e.g., k-NN) to synthesize viable approximations.',
                    'Indiscriminately deleting all rows bearing any missing attribute value, irrespective of frequency or pattern.',
                    'Appended binary indicator features to formally flag rows exhibiting a missing observation.'
                ],
                correctAnswer: 2
            },
            {
                type: 'Technical • Modeling',
                text: 'Which scenario constitutes "overfitting" during the training phase of a machine learning model?',
                options: [
                    'The model demonstrates chronically poor accuracy on both the training set and the hold-out validation set.',
                    'The model captures subtle noise and idiosyncrasies in the training facts resulting in exceptionally high training accuracy but poor generalization to unseen data.',
                    'The model lacks sufficient complexity or architectural depth to divine the underlying structure of the data.',
                    'The model demands training epochs that exceed the provisioned hardware memory constraints.'
                ],
                correctAnswer: 1
            },
            {
                type: 'Technical • Python',
                text: 'What functional constraint primarily distinguishes a tuple from a list in the Python programming language?',
                options: [
                    'Lists can be populated with multiple object types, whereas tuples are strictly typed arrays of numeric values.',
                    'Lists permit in-place mutability post-allocation, whereas tuples are strictly immutable once instantiated.',
                    'Lists enforce syntactical structure utilizing parenthesis `()`, whereas tuples dictate the usage of square brackets `[]`.',
                    'Tuples introduce profound iteration performance overhead when contrasted against native list traversals.'
                ],
                correctAnswer: 1
            }
        );
    } else {
        questions.push(
            {
                type: 'Technical • Algorithms',
                text: 'What are the characteristic average and worst-case time complexities associated with the Quicksort algorithm?',
                options: [
                    'Average Case: O(n log n), Worst Case: O(n log n)',
                    'Average Case: O(n^2), Worst Case: O(n^2)',
                    'Average Case: O(n log n), Worst Case: O(n^2)',
                    'Average Case: O(n), Worst Case: O(n log n)'
                ],
                correctAnswer: 2
            },
            {
                type: 'System Design',
                text: 'In formulating a reliable web application architecture, an infrastructural load balancer fundamentally provides which operational service?',
                options: [
                    'Systematically enforces encryption protocols on inbound and outbound HTTPS network traffic.',
                    'Locally caches substantial static network assets mitigating geographical latencies.',
                    'Logically distributes converging ingress traffic across an array of healthy redundant server instances.',
                    'Persistently catalogs active user session state matrices robust against isolated server faults.'
                ],
                correctAnswer: 2
            },
            {
                type: 'Technical • API',
                text: 'Which architectural constraint is imperative for a properly designed RESTful API?',
                options: [
                    'The API rigidly demands that all payload communication transpires exclusively encoded in XML.',
                    'The API backend tracks sequential state iterations natively per user session continuously.',
                    'The API executes as a stateless mechanism where any individual client request contains its full required context.',
                    'The API functions predominantly leveraging UDP based packet transactions circumventing heavy HTTP handshakes.'
                ],
                correctAnswer: 2
            },
            {
                type: 'Technical • Database',
                text: 'Regarding distributed or relational data transactions, what core principles construct the acronym ACID?',
                options: [
                    'Atomicity, Consistency, Isolation, Durability',
                    'Asynchronous, Concurrency, Integrity, Durability',
                    'Atomicity, Concurrency, Isolation, Dependency',
                    'Availability, Consistency, Interoperability, Durability'
                ],
                correctAnswer: 0
            }
        );
    }

    questions.push({
        type: 'Behavioral',
        text: 'During a pivotal project sprint, a pronounced disagreement on a foundational technical trajectory transpires between you and your senior technical lead. What is the most productive resolution methodology?',
        options: [
            'Clandestinely code your own architecture parallel to the master branch because it possesses distinct superior metrics.',
            'Immediately escalate the conflict to an organizational manager illustrating the lead\'s lack of contextual awareness.',
            'Rationally summarize factual operational data, outline comparative structural trade-offs collaboratively, and facilitate a measured logical discourse.',
            'Acquiesce swiftly to the senior lead’s proposed schema without critical feedback maintaining perceived subordinate harmony.'
        ],
        correctAnswer: 2
    });

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
    
    // MCQ specific state
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    
    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setQuestions(generateQuestions(selectedRole, difficulty));
            setSessionStarted(true);
            setCurrentIdx(0);
            setIsGenerating(false);
            setSelectedOption(null);
            setIsAnswerSubmitted(false);
            setScore(0);
            setIsCompleted(false);
        }, 1500);
    };

    const handleOptionSelect = (index: number) => {
        if (!isAnswerSubmitted && !isCompleted) {
            setSelectedOption(index);
        }
    };

    const handleSubmitAnswer = () => {
        if (selectedOption !== null && !isAnswerSubmitted) {
            setIsAnswerSubmitted(true);
            if (selectedOption === questions[currentIdx].correctAnswer) {
                setScore(prev => prev + 1);
            }
        }
    };

    const handleNextQuestion = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswerSubmitted(false);
        } else {
            setIsCompleted(true);
        }
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem" }}>
            
            {/* Main Content Area */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                
                {/* Setup Card */}
                {!sessionStarted && (
                <div className="glass-panel setup-card">
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Start a New Session</h2>
                    <p style={{ color: "var(--text-secondary)" }}>Select the role and difficulty level to generate AI questions.</p>

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
                            style={{ padding: "0.75rem 2rem", opacity: isGenerating ? 0.7 : 1 }}
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? "Generating..." : "Start Mock Test (MCQ)"}
                        </button>
                    </div>
                </div>
                )}

                {/* Practice Area */}
                {sessionStarted && !isCompleted && questions.length > 0 && (
                    <div className="glass-panel animate-fade-up" style={{ padding: "2rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
                            <span>Question {currentIdx + 1} of {questions.length}</span>
                            <span style={{ color: "var(--brand-primary)" }}>{questions[currentIdx].type}</span>
                        </div>

                        <div className="question-card" style={{ marginBottom: "2rem", padding: 0, background: "transparent", border: "none" }}>
                            <h3 style={{ fontSize: "1.25rem", lineHeight: 1.5 }}>
                                {questions[currentIdx].text}
                            </h3>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                            {questions[currentIdx].options.map((option: string, i: number) => {
                                let bgColor = "rgba(255,255,255,0.05)";
                                let borderColor = "transparent";
                                let textColor = "inherit";

                                if (isAnswerSubmitted) {
                                    if (i === questions[currentIdx].correctAnswer) {
                                        bgColor = "rgba(34, 197, 94, 0.1)";
                                        borderColor = "#22c55e"; // Green for correct
                                        textColor = "#4ade80";
                                    } else if (i === selectedOption) {
                                        bgColor = "rgba(239, 68, 68, 0.1)";
                                        borderColor = "#ef4444"; // Red for incorrect
                                        textColor = "#f87171";
                                    }
                                } else if (selectedOption === i) {
                                    bgColor = "rgba(255, 255, 255, 0.15)";
                                    borderColor = "var(--brand-primary)";
                                }

                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => handleOptionSelect(i)}
                                        style={{ 
                                            padding: "1rem 1.5rem", 
                                            background: bgColor,
                                            border: `2px solid ${borderColor}`,
                                            borderRadius: "8px",
                                            cursor: isAnswerSubmitted ? "default" : "pointer",
                                            transition: "all 0.2s",
                                            color: textColor
                                        }}
                                        className={!isAnswerSubmitted && selectedOption !== i ? "hover-mcq" : ""}
                                    >
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <div style={{
                                                width: "24px", height: "24px", borderRadius: "50%",
                                                border: `2px solid ${isAnswerSubmitted || selectedOption === i ? borderColor : "var(--text-secondary)"}`,
                                                marginRight: "1rem",
                                                display: "flex", justifyContent: "center", alignItems: "center",
                                                flexShrink: 0
                                            }}>
                                                {(selectedOption === i || (isAnswerSubmitted && i === questions[currentIdx].correctAnswer)) && (
                                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: borderColor }} />
                                                )}
                                            </div>
                                            <span style={{ flex: 1, fontSize: "1rem", lineHeight: "1.5" }}>{option}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <style dangerouslySetInnerHTML={{__html: `
                            .hover-mcq:hover {
                                background: rgba(255,255,255,0.1) !important;
                                border-color: rgba(255,255,255,0.2) !important;
                            }
                        `}} />

                        {isAnswerSubmitted && (
                            <div className="feedback-box animate-fade-up" style={{ marginBottom: "2rem", padding: "1rem", background: selectedOption === questions[currentIdx].correctAnswer ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", borderRadius: "8px", borderLeft: `4px solid ${selectedOption === questions[currentIdx].correctAnswer ? "#22c55e" : "#ef4444"}` }}>
                                <h4 style={{ color: selectedOption === questions[currentIdx].correctAnswer ? "#4ade80" : "#f87171", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                                    {selectedOption === questions[currentIdx].correctAnswer ? "✅ Correct!" : "❌ Incorrect"}
                                </h4>
                                {selectedOption !== questions[currentIdx].correctAnswer && (
                                    <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>The correct answer is Option {questions[currentIdx].correctAnswer + 1}.</p>
                                )}
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            {!isAnswerSubmitted ? (
                                <button 
                                    className="btn-primary" 
                                    onClick={handleSubmitAnswer}
                                    disabled={selectedOption === null}
                                    style={{ opacity: selectedOption === null ? 0.5 : 1, padding: "0.75rem 2rem" }}
                                >
                                    Submit Answer
                                </button>
                            ) : (
                                <button 
                                    className="btn-primary" 
                                    onClick={handleNextQuestion}
                                    style={{ padding: "0.75rem 2rem" }}
                                >
                                    {currentIdx < questions.length - 1 ? "Next Question" : "Finish Interview"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Completion Area */}
                {isCompleted && (
                     <div className="glass-panel animate-fade-up" style={{ padding: "4rem 2rem", textAlign: "center" }}>
                         <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎯</div>
                         <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--brand-primary)" }}>Interview Complete!</h2>
                         <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
                             You scored <span style={{ color: "white", fontWeight: "bold" }}>{score}</span> out of <span style={{ color: "white", fontWeight: "bold" }}>{questions.length}</span> questions perfectly.
                         </p>
                         <button 
                             className="btn-primary" 
                             onClick={() => setSessionStarted(false)}
                             style={{ padding: "0.75rem 2rem" }}
                         >
                             Start New Session
                         </button>
                     </div>
                )}
            </div>

            {/* Previous Sessions */}
            <div className="glass-panel" style={{ padding: "1.5rem", height: "fit-content" }}>
                <h3 style={{ fontSize: "1.125rem", marginBottom: "1.5rem" }}>Past Sessions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {initialInterviews.length === 0 ? (
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>No past sessions found.</p>
                    ) : (
                        initialInterviews.map((interview: any) => (
                            <div key={interview.id} style={{ padding: "1rem", background: "var(--bg-card)", borderRadius: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                    <span style={{ fontWeight: 600 }}>{interview.role}</span>
                                    <span style={{ color: "var(--brand-accent)", fontWeight: "bold" }}>{interview.score}/100</span>
                                </div>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
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
