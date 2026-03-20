import { getUserProfile } from '@/app/actions'
import JobMatchesClient from './JobMatchesClient'
import AlertPreferencesClient from './AlertPreferencesClient'

export default async function JobMatches() {
    const user = await getUserProfile();

    if (!user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>User not found.</div>
    }

    const { jobMatches, resumeScore } = user;

    return (
        <div className="jobs-page animate-fade-up">
            <style dangerouslySetInnerHTML={{
                __html: `
        .job-card {
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 1.5rem;
          transition: var(--transition-normal);
        }

        .company-logo {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: var(--bg-card-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .job-meta {
          display: flex;
          gap: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .match-badge {
          padding: 0.25rem 0.75rem;
          background: rgba(20, 184, 166, 0.15);
          color: var(--brand-accent);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .filter-btn {
          padding: 0.5rem 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 9999px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-normal);
        }
        
        .filter-btn.active {
          background: var(--brand-primary);
          color: white;
          border-color: var(--brand-primary);
        }
      `}} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '0 0 2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Smart Job Matches</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Based on your {resumeScore?.overallScore || 0}/100 Resume Score.</p>
                </div>
                <div>
                    <AlertPreferencesClient />
                </div>
            </div>

            <JobMatchesClient initialJobs={jobMatches} />
        </div>
    );
}
