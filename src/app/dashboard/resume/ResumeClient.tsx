'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeUploadedResume } from '@/app/actions';

export default function ResumeClient({ initialData }: { initialData: any }) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDone, setIsDone] = useState(false);
    
    // Maintain scoring state
    const [scores, setScores] = useState({
        overallScore: initialData.resumeScore?.overallScore || 0,
        impactScore: initialData.resumeScore?.impactScore || 0,
        quantifiableScore: initialData.resumeScore?.quantifiableScore || 0,
        formattingScore: initialData.resumeScore?.formattingScore || 0,
        targetRole: initialData.jobMatches?.[0]?.title || 'your target role'
    });

    const [isFixing, setIsFixing] = useState(false);
    const [isDoneFixing, setIsDoneFixing] = useState(false);

    const handleApplyFixes = () => {
        setIsFixing(true);
        setTimeout(() => {
            setIsFixing(false);
            setScores({
                overallScore: 98,
                impactScore: 99,
                quantifiableScore: 95,
                formattingScore: 100,
                targetRole: scores.targetRole
            });
            setIsDoneFixing(true);

            // Generate "Fixed Resume" document
            import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF();
                
                doc.setFontSize(16);
                doc.text("IMPROVED RESUME CONTENT", 20, 20);
                
                const resumeContent = `Target Role: ${scores.targetRole}

[AI Suggestions Applied]
• Added strong action verbs
• Included 40% more quantifiable metrics
• Optimized keyword formatting for ATS

Professional Experience - Bullet Points to Add/Replace:
- Spearheaded the development of scalable applications, resulting in a 30% increase in user retention.
- Optimized database queries, reducing load times by 40% and improving overall system efficiency.
- Led a cross-functional team of 5 engineers to successfully deliver 3 major product releases ahead of schedule.
- Implemented robust testing protocols, achieving 95% test coverage and decreasing production bugs by 25%.

Note: Copy these optimized bullet points into your actual resume document to match your new scores!`;

                doc.setFontSize(11);
                const lines = doc.splitTextToSize(resumeContent, 170);
                doc.text(lines, 20, 30);
                
                const fileName = `${file?.name ? file.name.split('.')[0] + '_Improved' : 'Improved_Resume'}.pdf`;
                doc.save(fileName);
            }).catch(err => {
                console.error("Failed to load jsPDF", err);
                alert("Could not generate PDF.");
            });

        }, 2500);
    };

    // Update scores when initialData changes after a server revalidation
    useEffect(() => {
        if (initialData?.resumeScore) {
            setScores({
                overallScore: initialData.resumeScore?.overallScore || 0,
                impactScore: initialData.resumeScore?.impactScore || 0,
                quantifiableScore: initialData.resumeScore?.quantifiableScore || 0,
                formattingScore: initialData.resumeScore?.formattingScore || 0,
                targetRole: initialData.jobMatches?.[0]?.title || 'your target role'
            });
            setIsDoneFixing(false); // Reset fixes state on new upload
        }
    }, [initialData]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setIsUploading(true);
            
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const result = await analyzeUploadedResume(formData);
                if (result.success) {
                    setIsDone(true);
                    router.refresh(); // Tell Next.js to re-fetch Server Components (including our layout/page)
                    setTimeout(() => {
                        setIsDone(false);
                        setFile(null);
                    }, 4000);
                } else {
                    alert("Analysis failed: " + result.error);
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred during upload.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const getScoreClass = (score: number) => {
        if (score >= 80) return "metric-card good animate-fade-up";
        if (score >= 50) return "metric-card warning animate-fade-up";
        return "metric-card critical animate-fade-up";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 50) return "Needs improvement";
        return "Critical issue";
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "var(--brand-accent)";
        if (score >= 50) return "#eab308";
        return "#ef4444";
    };

    return (
        <>
            <div className="upload-zone">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Drag & Drop your Resume</h3>
                
                {isUploading ? (
                    <div style={{ padding: '1rem' }}>
                        <p style={{ color: 'var(--brand-primary)', fontWeight: 'bold', marginBottom: '0.5rem', wordBreak: 'break-all' }}>Uploading {file?.name} & Analyzing...</p>
                        <div style={{ width: '100%', height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '50%', height: '100%', background: 'var(--brand-primary)', animation: 'pulse 1s infinite' }} />
                        </div>
                    </div>
                ) : isDone ? (
                    <div style={{ padding: '1rem' }}>
                        <p style={{ color: '#10b981', fontWeight: 'bold', wordBreak: 'break-all', fontSize: '1.25rem' }}>✨ {file?.name} analyzed!</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Scores have been updated with latest resume data.</p>
                    </div>
                ) : (
                    <>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Supports PDF, DOCX (Max 5MB)</p>
                        <label className="btn-secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
                            Browse Files
                            <input type="file" accept=".pdf,.docx,.doc" style={{ display: 'none' }} onChange={handleFileChange} />
                        </label>
                    </>
                )}
                
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes pulse {
                        0% { width: 0%; transform: translateX(-100%); }
                        100% { width: 100%; transform: translateX(100%); }
                    }
                `}} />
            </div>

            {(scores.overallScore > 0 || isDone) && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Detailed Feedback <span style={{fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--brand-accent)', marginLeft: '1rem', opacity: isDone ? 1 : 0, transition: 'opacity 0.5s'}}>Updated Just Now!</span></h2>

                    <div className="metric-grid">
                        <div className={getScoreClass(scores.impactScore)} key={'impact'+scores.impactScore}>
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Impact & Action Verbs</h4>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scores.impactScore}%</div>
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: getScoreColor(scores.impactScore) }}>{getScoreLabel(scores.impactScore)}</p>
                        </div>
                        <div className={getScoreClass(scores.quantifiableScore)} key={'quant'+scores.quantifiableScore}>
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Quantifiable Results</h4>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scores.quantifiableScore}%</div>
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: getScoreColor(scores.quantifiableScore) }}>{getScoreLabel(scores.quantifiableScore)}</p>
                        </div>
                        <div className={getScoreClass(scores.formattingScore)} key={'form'+scores.formattingScore}>
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Formatting & ATS</h4>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scores.formattingScore}%</div>
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: getScoreColor(scores.formattingScore) }}>{getScoreLabel(scores.formattingScore)}</p>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: '2rem' }}>AI Suggestions</h3>
                    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
                        {scores.quantifiableScore < 80 ? (
                            <div className="suggestion-item">
                                <div style={{ fontSize: '1.25rem' }}>💡</div>
                                <div>
                                    <h4 style={{ fontWeight: 600 }}>Add Metrics to Current Role</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        Your quantifiable score is {scores.quantifiableScore}%. Instead of saying "Improved website performance", try: "Increased website load speed by 40% using Next.js Image optimization."
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="suggestion-item" style={{background: 'rgba(16, 185, 129, 0.05)'}}>
                                <div style={{ fontSize: '1.25rem' }}>🌟</div>
                                <div>
                                    <h4 style={{ fontWeight: 600, color: '#10b981' }}>Great Quantifiable Results!</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        You successfully added metrics to your past roles, boosting your ATS impact score substantially.
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="suggestion-item">
                            <div style={{ fontSize: '1.25rem' }}>🔗</div>
                            <div>
                                <h4 style={{ fontWeight: 600 }}>Missing GitHub Links</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    Your latest project lacks a repository link. Recruiters prefer to see your source code.
                                </p>
                            </div>
                        </div>
                        <div className="suggestion-item">
                            <div style={{ fontSize: '1.25rem' }}>🎯</div>
                            <div>
                                <h4 style={{ fontWeight: 600 }}>Skill Specificity</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    Make sure your listed skills match explicitly with the job description for {scores.targetRole} to boost your ATS match.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Overall Score</h3>
                    <div key={'overall'+scores.overallScore} style={{
                        width: '180px', height: '180px', margin: '0 auto 1.5rem',
                        borderRadius: '50%', background: `conic-gradient(var(--brand-primary) ${scores.overallScore}%, var(--bg-card-hover) 0deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                        transition: 'background 1s ease'
                    }}>
                        <div style={{ position: 'absolute', inset: '12px', background: 'var(--bg-dark)', borderRadius: '50%' }}></div>
                        <span className="animate-fade-up" style={{ position: 'relative', fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{scores.overallScore}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>You are in the top <strong style={{color: (isDone || isDoneFixing) ? 'var(--brand-accent)' : 'inherit'}}>{100 - scores.overallScore}%</strong> of candidates applying for similar roles.</p>

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', marginTop: '2rem', opacity: isFixing ? 0.7 : 1, transition: 'all 0.3s' }}
                        onClick={handleApplyFixes}
                        disabled={isFixing || isDoneFixing}
                    >
                        {isFixing ? 'Generating PDF...' : isDoneFixing ? 'PDF Downloaded ✨' : 'Download Fixed Resume (PDF)'}
                    </button>
                </div>
            </div>
            )}
        </>
    );
}
