import { getUserProfile } from '@/app/actions'
import PortfolioClient from './PortfolioClient'

export default async function PortfolioGenerator() {
    const user = await getUserProfile();

    if (!user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>User not found.</div>
    }

    const portfolio = user.portfolios[0];
    const username = user.name.toLowerCase().replace(/\s+/g, '');

    return (
        <div className="portfolio-page animate-fade-up">
            <style dangerouslySetInnerHTML={{
                __html: `
        .split-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          min-height: calc(100vh - 12rem);
        }

        .controls-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .control-group {
          margin-bottom: 1rem;
        }

        .control-label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .theme-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .theme-btn {
          padding: 1rem;
          border-radius: 8px;
          border: 2px solid transparent;
          background: var(--bg-card-hover);
          color: white;
          cursor: pointer;
          transition: var(--transition-normal);
          text-align: center;
        }

        .theme-btn.active {
          border-color: ${portfolio?.color || 'var(--brand-primary)'};
          background: rgba(99, 102, 241, 0.1);
        }

        .preview-panel {
          background: #ffffff; /* Light background for preview contrast */
          border-radius: 16px;
          border: 1px solid var(--border-light);
          overflow: hidden;
          position: relative;
        }

        /* Mockup inner UI for the portfolio preview */
        .mockup-header {
          height: 40px;
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          gap: 0.5rem;
        }

        .mockup-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .mockup-body {
          height: calc(100% - 40px);
          padding: 3rem;
          color: #0f172a;
          overflow-y: auto;
        }

        /* Scrollbar styling for mockup */
        .mockup-body::-webkit-scrollbar {
          width: 8px;
        }
        .mockup-body::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
      `}} />

            <PortfolioClient user={user} initialPortfolio={portfolio} />
        </div>
    );
}
