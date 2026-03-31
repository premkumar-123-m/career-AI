import { getDashboardStats } from '@/app/actions'
import Link from 'next/link'

export default async function Dashboard() {
    const stats = await getDashboardStats();

    if (!stats) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Database not connected or User not found. Run seed script!</div>
    }

    const { user, resumeScore, matchedJobsCount, skillGapsCount } = stats;
    const topJobs = user.jobMatches.slice(0, 2);
    const topSkills = user.skillGaps.slice(0, 2);
    const resumeFeedback = user.resumeScores[0]?.feedback || "No feedback yet.";

    return (
        <div className="dashboard-home">
            <style dangerouslySetInnerHTML={{
                __html: `
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--brand-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
        }

        .stat-content h4 {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-content .value {
          font-size: 2rem;
          font-weight: 700;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .panel-title {
          font-size: 1.25rem;
          font-weight: 600;
        }

        /* Circular Progress styling for Resume Score */
        .circular-progress {
          position: relative;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: conic-gradient(var(--brand-primary) ${resumeScore}%, var(--bg-card-hover) 0deg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .circular-progress::before {
          content: "";
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          background: var(--bg-card);
        }

        .progress-value {
          position: relative;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .timeline-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .timeline-item::before {
          content: "";
          position: absolute;
          left: 19px;
          top: 40px;
          bottom: -1.5rem;
          width: 2px;
          background: var(--border-light);
        }

        .timeline-item:last-child::before {
          display: none;
        }

        .timeline-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-card-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
      `}} />

            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, {user.name}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Here is your daily career summary and next steps.</p>

            {/* Top Stats Overview */}
            <div className="overview-grid animate-fade-up">
                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.1)', color: 'var(--brand-accent)' }}>🎯</div>
                    <div className="stat-content">
                        <h4>Resume Score</h4>
                        <div className="value">{resumeScore}/100</div>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--brand-secondary)' }}>💼</div>
                    <div className="stat-content">
                        <h4>Matched Jobs</h4>
                        <div className="value">{matchedJobsCount}</div>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon">🎓</div>
                    <div className="stat-content">
                        <h4>Skill Gaps</h4>
                        <div className="value">{skillGapsCount} Found</div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="bento-grid animate-fade-up delay-100">

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* AI Recommendations */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div className="panel-header">
                            <h3 className="panel-title">AI Job Recommendations</h3>
                            <Link href="/dashboard/jobs" style={{ color: 'var(--brand-primary)', fontSize: '0.875rem' }}>View All</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {topJobs.map((job: any) => (
                                <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-card-hover)', borderRadius: '12px' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 600 }}>{job.title}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{job.company}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>{job.matchPercentage}% Match</div>
                                        <button className="btn-secondary" style={{ padding: '0.25rem 1rem', fontSize: '0.875rem', marginTop: '0.5rem' }}>Apply</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill Gaps */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div className="panel-header">
                            <h3 className="panel-title">Identified Skill Gaps & Courses</h3>
                            <Link href="/dashboard/skills" style={{ color: 'var(--brand-primary)', fontSize: '0.875rem' }}>View Details</Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {topSkills.map((gap: any) => (
                                <div key={gap.id} style={{ padding: '1.25rem', background: 'var(--bg-card-hover)', borderRadius: '12px' }}>
                                    <h4 style={{ fontWeight: 600, color: gap.category === 'Frontend' ? '#ef4444' : '#eab308', marginBottom: '0.5rem' }}>
                                        {gap.category}: {gap.skill}
                                    </h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                        Current limit: {gap.proficiency}
                                    </p>
                                    <span style={{ color: 'var(--brand-primary)', fontSize: '0.875rem', cursor: 'pointer' }}>Recommended Course ↗</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Resume Score Widget */}
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 className="panel-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>AI Resume Analysis</h3>
                        <div className="circular-progress">
                            <span className="progress-value">{resumeScore}</span>
                        </div>
                        <p style={{ color: 'var(--brand-accent)', fontWeight: 500, marginBottom: '1rem' }}>Great Profile! 🚀</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            "{resumeFeedback}"
                        </p>
                        <Link href="/dashboard/resume" className="btn-primary" style={{ display: 'block', width: '100%' }}>Improve Resume</Link>
                    </div>

                    {/* Action Plan */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 className="panel-title">Your Action Plan</h3>
                        <div style={{ marginTop: '1.5rem' }}>
                            <div className="timeline-item">
                                <div className="timeline-icon">✅</div>
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Upload Resume</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Completed recently</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon" style={{ background: 'var(--gradient-brand)', color: 'white' }}>⏳</div>
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Mock Test Practice</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending action</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
