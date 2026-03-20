import { getUserProfile } from '@/app/actions'
import InterviewClient from './InterviewClient'

export default async function MockInterviews() {
    const user = await getUserProfile();

    if (!user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>User not found.</div>
    }

    const { interviews, jobMatches } = user;
    const targetRole = jobMatches[0]?.title || 'Frontend Developer';

    return (
        <div className="interviews-page animate-fade-up">
            <style dangerouslySetInnerHTML={{
                __html: `
        .setup-card {
          padding: 2.5rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .select-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .select-input {
          padding: 0.75rem 1.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          color: white;
          border-radius: 8px;
          min-width: 200px;
          font-family: inherit;
        }

        .question-card {
          padding: 2rem;
          background: var(--bg-card-hover);
          border-radius: 12px;
          margin-bottom: 1.5rem;
          border-left: 4px solid var(--brand-secondary);
        }

        .record-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 2rem auto;
          cursor: pointer;
          border: 2px solid #ef4444;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .record-btn:hover {
          background: #ef4444;
          color: white;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
          transform: scale(1.05);
        }
        
        .timer {
          font-family: monospace;
          font-size: 1.5rem;
          text-align: center;
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }

        .feedback-box {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(20, 184, 166, 0.05);
          border: 1px dashed var(--brand-accent);
          border-radius: 8px;
        }
      `}} />

            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>AI Mock Interview</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Practice answering technical and behavioral questions tailored to your target role: <strong>{targetRole}</strong>.
            </p>

            <InterviewClient targetRole={targetRole} initialInterviews={interviews} />
        </div>
    );
}
