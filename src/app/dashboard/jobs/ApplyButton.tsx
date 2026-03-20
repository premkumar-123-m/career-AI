'use client'

import { useState } from 'react';
import { applyForJob } from '@/app/actions';

export default function ApplyButton({ jobId, initialStatus, company, title }: { jobId: string, initialStatus: string, company: string, title: string }) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleApply = async () => {
        setIsLoading(true);
        setStatus('Applying...');
        
        try {
            const result = await applyForJob(jobId);
            if (result.success) {
                setStatus('Applied');
                
                // Open external link
                const query = encodeURIComponent(`${title} ${company.replace('(AI Matched)', '').trim()} job application`);
                window.open(`https://www.google.com/search?q=${query}`, '_blank');

            } else {
                setStatus(initialStatus);
                alert("Failed to apply: " + result.error);
            }
        } catch (error) {
            console.error(error);
            setStatus(initialStatus);
        } finally {
            setIsLoading(false);
        }
    };

    const isApplied = status === 'Applied';

    return (
        <button 
            className="btn-primary" 
            style={{ 
                padding: '0.5rem 1.5rem', 
                fontSize: '0.875rem', 
                opacity: isApplied ? 0.7 : 1,
                cursor: (isApplied || isLoading) ? 'default' : 'pointer',
                background: isApplied ? 'var(--bg-card-hover)' : 'var(--brand-primary)',
                color: isApplied ? 'var(--text-secondary)' : 'white',
                border: isApplied ? '1px solid var(--border-light)' : 'none'
            }}
            onClick={handleApply}
            disabled={isApplied || isLoading}
        >
            {isLoading ? 'Applying...' : isApplied ? '✓ Applied' : 'Apply via AI'}
        </button>
    );
}
