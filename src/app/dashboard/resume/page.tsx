import { getUserProfile } from '@/app/actions'
import ResumeClient from './ResumeClient'
import GeneratePDFButton from './GeneratePDFButton'

export default async function ResumeAnalysis() {
    const user = await getUserProfile();

    if (!user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>User not found.</div>
    }

    return (
        <div className="resume-page animate-fade-up">
            <style dangerouslySetInnerHTML={{
                __html: `
        .resume-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }

        .upload-zone {
          border: 2px dashed var(--brand-primary);
          background: rgba(99, 102, 241, 0.05);
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          transition: var(--transition-normal);
          margin-bottom: 2rem;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          padding: 1.5rem;
          border-radius: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          transition: border-color 0.5s ease;
        }

        .metric-card.good { border-left: 4px solid var(--brand-accent); }
        .metric-card.warning { border-left: 4px solid #eab308; }
        .metric-card.critical { border-left: 4px solid #ef4444; }

        .suggestion-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
          transition: background 0.5s ease;
        }
        
        .suggestion-item:last-child {
          border-bottom: none;
        }

        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          body * {
            visibility: hidden;
          }
          .resume-page, .resume-page * {
            visibility: visible;
          }
          .resume-page {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 2rem;
            color: black !important;
          }
          /* Hide non-printable elements */
          .upload-zone, button, .sidebar, nav, header {
            display: none !important;
          }
          .metric-card.good { border-left-color: #10b981 !important; }
          .metric-card.warning { border-left-color: #eab308 !important; }
          .metric-card.critical { border-left-color: #ef4444 !important; }
          .metric-card { outline: 1px solid #ccc; background: white !important; }
          * {
            box-shadow: none !important;
            text-shadow: none !important;
          }
        }
      `}} />

            <div className="resume-header">
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Resume Analysis</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Upload your latest resume to get an AI-powered score and feedback.</p>
                </div>
                <GeneratePDFButton />
            </div>

            <ResumeClient initialData={user} />

        </div>
    );
}
