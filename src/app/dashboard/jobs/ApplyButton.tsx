'use client'

import { useState } from 'react';
import { applyForJob } from '@/app/actions';

export default function ApplyButton({ jobId, initialStatus, company, title }: { jobId: string, initialStatus: string, company: string, title: string }) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const [applyingTo, setApplyingTo] = useState<string | null>(null);

    const handleApply = async (platform: 'linkedin' | 'naukri') => {
        setIsLoading(true);
        setApplyingTo(platform);
        setStatus('Applying...');
        
        try {
            const result = await applyForJob(jobId);
            if (result.success) {
                setStatus('Applied');
                
                // Open external link
                const query = encodeURIComponent(`${title} ${company.replace('(AI Matched)', '').trim()}`);
                if (platform === 'linkedin') {
                    window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}`, '_blank');
                } else if (platform === 'naukri') {
                    window.open(`https://www.naukri.com/search?q=${query}`, '_blank');
                }
            } else {
                setStatus(initialStatus);
                alert("Failed to apply: " + result.error);
            }
        } catch (error) {
            console.error(error);
            setStatus(initialStatus);
        } finally {
            setIsLoading(false);
            setApplyingTo(null);
        }
    };

    const isApplied = status === 'Applied';

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
                className="btn-primary" 
                style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.875rem', 
                    opacity: isApplied ? 0.7 : 1,
                    cursor: (isApplied || isLoading) ? 'default' : 'pointer',
                    background: isApplied ? 'var(--bg-card-hover)' : '#0A66C2', // LinkedIn blue
                    color: isApplied ? 'var(--text-secondary)' : 'white',
                    border: isApplied ? '1px solid var(--border-light)' : 'none'
                }}
                onClick={() => handleApply('linkedin')}
                disabled={isApplied || isLoading}
            >
                {isLoading && applyingTo === 'linkedin' ? 'Applying...' : isApplied ? 'Applied' : 'LinkedIn'}
            </button>
            <button 
                className="btn-primary" 
                style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.875rem', 
                    opacity: isApplied ? 0.7 : 1,
                    cursor: (isApplied || isLoading) ? 'default' : 'pointer',
                    background: isApplied ? 'var(--bg-card-hover)' : '#275DF5', // Naukri blue
                    color: isApplied ? 'var(--text-secondary)' : 'white',
                    border: isApplied ? '1px solid var(--border-light)' : 'none'
                }}
                onClick={() => handleApply('naukri')}
                disabled={isApplied || isLoading}
            >
                {isLoading && applyingTo === 'naukri' ? 'Applying...' : isApplied ? 'Applied' : 'Naukri'}
            </button>
        </div>
    );
}
