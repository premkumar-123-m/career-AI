'use client'

import { useState } from 'react';
import ApplyButton from './ApplyButton';

export default function JobMatchesClient({ initialJobs }: { initialJobs: any[] }) {
    const [filter, setFilter] = useState('All Matches');

    const filteredJobs = initialJobs.filter(job => {
        if (filter === 'All Matches') return true;
        if (filter === 'Full-Time Jobs') return job.type?.includes('Full-Time');
        if (filter === 'Internships') return job.type?.includes('Internship');
        if (filter === 'Remote Only') return job.type?.includes('Remote');
        return true;
    });

    return (
        <>
            <div className="filters">
                <button 
                    className={`filter-btn ${filter === 'All Matches' ? 'active' : ''}`}
                    onClick={() => setFilter('All Matches')}
                >
                    All Matches
                </button>
                <button 
                    className={`filter-btn ${filter === 'Full-Time Jobs' ? 'active' : ''}`}
                    onClick={() => setFilter('Full-Time Jobs')}
                >
                    Full-Time Jobs
                </button>
                <button 
                    className={`filter-btn ${filter === 'Internships' ? 'active' : ''}`}
                    onClick={() => setFilter('Internships')}
                >
                    Internships
                </button>
                <button 
                    className={`filter-btn ${filter === 'Remote Only' ? 'active' : ''}`}
                    onClick={() => setFilter('Remote Only')}
                >
                    Remote Only
                </button>
            </div>

            <div className="job-list">
                {filteredJobs.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No job matches found for this filter.</p>
                ) : (
                    filteredJobs.map((job: any) => (
                        <div className="job-card glass-panel" key={job.id}>
                            <div className="company-logo">{job.company?.[0] || 'C'}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 className="job-title">{job.title}</h3>
                                        <div className="job-meta">
                                            <span>{job.company}</span>
                                            {job.location && <><span>•</span><span>{job.location}</span></>}
                                            {job.type && <><span>•</span><span>{job.type}</span></>}
                                            {job.salary && <><span>•</span><span>{job.salary}</span></>}
                                        </div>
                                    </div>
                                    <div className="match-badge">
                                        ✨ {job.matchPercentage}% Match
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {job.tags && (job.tags as string).split(',').map((t: string, i: number) => (
                                            <span key={i} style={{ background: 'var(--bg-card)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.trim()}</span>
                                        ))}
                                    </div>
                                    <ApplyButton jobId={job.id} initialStatus={job.status || 'Recommended'} company={job.company} title={job.title} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
