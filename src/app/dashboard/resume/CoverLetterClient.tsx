'use client';

import { useState } from 'react';
import { generateCoverLetterAction } from '@/app/actions';

export default function CoverLetterClient() {
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!jobTitle || !company) {
            setError("Please provide both Job Title and Company.");
            return;
        }

        setIsGenerating(true);
        setError('');
        setCoverLetter('');

        const res = await generateCoverLetterAction(jobTitle, company);

        if (res.success && res.coverLetter) {
            setCoverLetter(res.coverLetter);
        } else {
            setError(res.error || "Failed to generate cover letter.");
        }

        setIsGenerating(false);
    };

    return (
        <div className="cover-letter-section" style={{ marginTop: '3rem', padding: '2rem', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-card)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI Cover Letter Generator</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Use your uploaded resume data to automatically generate a personalized cover letter.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input 
                    type="text" 
                    placeholder="Target Job Title (e.g. Frontend Developer)" 
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                />
                <input 
                    type="text" 
                    placeholder="Target Company (e.g. Google)" 
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                />
                <button 
                    className="btn-primary" 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {isGenerating ? 'Generating...' : '✨ Generate Letter'}
                </button>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', color: '#ef4444', marginBottom: '1rem', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            {coverLetter && (
                <div style={{ marginTop: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Your Cover Letter:</h3>
                    <div style={{ padding: '1.5rem', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-light)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {coverLetter}
                    </div>
                    <button 
                        className="btn-secondary" 
                        onClick={() => navigator.clipboard.writeText(coverLetter)}
                        style={{ marginTop: '1rem' }}
                    >
                        Copy to Clipboard
                    </button>
                </div>
            )}
        </div>
    );
}
