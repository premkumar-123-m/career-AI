import { getUserProfile } from '@/app/actions'
import EnrollButton from './EnrollButton'

export default async function SkillGap() {
    const user = await getUserProfile();

    if (!user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>User not found.</div>
    }

    const { skillGaps, jobMatches } = user;
    const targetRole = jobMatches[0]?.title || 'Desired Role';

    const getGradientForProficiency = (progress: number) => {
        if (progress >= 80) return 'linear-gradient(90deg, #14b8a6, #0d9488)';
        if (progress >= 40) return 'linear-gradient(90deg, #eab308, #ca8a04)';
        return 'linear-gradient(90deg, #ef4444, #b91c1c)';
    };

    const getColorForProficiency = (progress: number) => {
        if (progress >= 80) return 'var(--brand-accent)';
        if (progress >= 40) return '#eab308';
        return '#ef4444';
    };

    return (
        <div className="skills-page animate-fade-up">
            <style dangerouslySetInnerHTML={{
                __html: `
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .skill-bar-container {
          margin-bottom: 1.5rem;
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .skill-bar {
          height: 8px;
          background: var(--bg-card);
          border-radius: 4px;
          overflow: hidden;
        }

        .skill-fill {
          height: 100%;
          border-radius: 4px;
        }

        .course-card {
          padding: 1.5rem;
          border-radius: 12px;
          background: var(--bg-card-hover);
          display: flex;
          gap: 1.5rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .course-img {
          width: 80px;
          height: 80px;
          background: rgba(99, 102, 241, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .badge {
          padding: 0.25rem 0.5rem;
          background: rgba(20, 184, 166, 0.15);
          color: var(--brand-accent);
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}} />

            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Skill Gap Analysis</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Compare your skillset against industry standards for <strong>{targetRole}</strong>.
            </p>

            <div className="skills-grid">
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Your Skills vs Market</h2>

                    {skillGaps.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No skill gaps identified yet.</p>
                    ) : (
                        skillGaps.map((gap: any) => (
                            <div key={gap.id} className="skill-bar-container">
                                <div className="skill-header">
                                    <span>{gap.skill}</span>
                                    <span style={{ color: getColorForProficiency(gap.progress) }}>{gap.proficiency} ({gap.progress}%)</span>
                                </div>
                                <div className="skill-bar">
                                    <div className="skill-fill" style={{ width: `${gap.progress}%`, background: getGradientForProficiency(gap.progress) }}></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>AI Course Recommendations</h2>
                        <span className="badge">Tailored for You</span>
                    </div>

                    {skillGaps.slice(0, 2).map((gap: any, index: number) => (
                        <div key={index} className="course-card">
                            <div className="course-img">{index === 0 ? '📘' : '🐻'}</div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: 600 }}>Mastering {gap.skill}</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {gap.category} Focus • {index === 0 ? 'Free' : '$12.99'}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: getColorForProficiency(gap.progress) }}>Closes {gap.skill} Gap (+{100 - gap.progress}%)</span>
                                    <EnrollButton skill={gap.skill} />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
