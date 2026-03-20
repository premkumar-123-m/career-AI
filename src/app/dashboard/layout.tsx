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
          background: var(--bg-dark);
        }

        .sidebar {
          width: 280px;
          background: rgba(7, 7, 10, 0.8);
          border-right: 1px solid var(--border-light);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          backdrop-filter: blur(12px);
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
          border-radius: 12px;
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
            <span>🎙️</span> Mock Interviews
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
