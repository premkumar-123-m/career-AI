import { getUserProfile } from '@/app/actions';
import { redirect } from 'next/navigation';
import EditableProfile from './EditableProfile';
import LogoutButton from './LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserProfile();
  
  if (!user) {
      redirect('/login');
  }

  const firstName = user.name.split(' ')[0];

  return (
    <div className="dashboard-wrapper">
      <style dangerouslySetInnerHTML={{
        __html: `
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          background: var(--bg-main);
        }

        .sidebar {
          width: 280px;
          background: var(--bg-card);
          border-right: 1px solid var(--border-light);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 40;
        }

        .sidebar-brand {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 3rem;
          padding-left: 1rem;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: var(--text-secondary);
          transition: var(--transition-normal);
          font-weight: 500;
        }

        .nav-item:hover, .nav-item.active {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }
        
        .nav-item.active {
          border-left: 3px solid var(--brand-primary);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 2rem;
          border-top: 1px solid var(--border-light);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 1rem;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 2rem 3rem;
          max-width: 1400px;
        }

        header.topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        /* --- Mobile Dashboard --- */
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: 70px;
            bottom: 0;
            top: auto;
            flex-direction: row;
            padding: 0.5rem;
            border-right: none;
            border-top: 1px solid var(--border-light);
            justify-content: space-around;
            align-items: center;
          }

          .sidebar-brand, .sidebar-footer {
            display: none;
          }

          .nav-menu {
            flex-direction: row;
            width: 100%;
            justify-content: space-around;
            gap: 0;
          }

          .nav-item {
            flex-direction: column;
            padding: 0.5rem;
            gap: 0.25rem;
            font-size: 0.7rem;
            text-align: center;
          }

          .nav-item.active {
            border-left: none;
            border-top: 3px solid var(--brand-primary);
            border-radius: 0;
            background: transparent;
            color: var(--brand-primary) !important;
          }

          .main-content {
            margin-left: 0;
            padding: 1.5rem 1rem 100px 1rem; /* Extra padding at bottom for nav */
          }

          header.topbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          header.topbar > div:last-child {
            width: 100%;
          }
          
          header.topbar .btn-primary {
            width: 100%;
            text-align: center;
          }
        }
      `}} />

      <aside className="sidebar">
        <div className="sidebar-brand text-gradient">CareerAI</div>

        <nav className="nav-menu">
          <a href="/dashboard" className="nav-item active">
            <span>📊</span> Dashboard
          </a>
          <a href="/dashboard/resume" className="nav-item">
            <span>📄</span> Resume Score
          </a>
          <a href="/dashboard/jobs" className="nav-item">
            <span>💼</span> Job Matches
          </a>
          <a href="/dashboard/skills" className="nav-item">
            <span>🎯</span> Skill Gap
          </a>
          <a href="/dashboard/interviews" className="nav-item">
            <span>🎙️</span> Mock Test
          </a>
          <a href="/dashboard/portfolio" className="nav-item">
            <span>🌐</span> Generator
          </a>
        </nav>

        <div className="sidebar-footer">
          <EditableProfile user={user} />
          <div style={{ marginTop: '1rem' }}>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Welcome back, {firstName}! 👋</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Let's level up your career today.</p>
          </div>
          <div>
            <a href="/dashboard/portfolio" className="btn-primary" style={{ padding: '0.5rem 1.25rem', textDecoration: 'none' }}>View Portfolio</a>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
