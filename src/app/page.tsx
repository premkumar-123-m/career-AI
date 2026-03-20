import styles from './page.module.css';

export default function Home() {
  return (
    <div className="page-wrapper">
      <style dangerouslySetInnerHTML={{
        __html: `
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 8rem 2rem 4rem;
          position: relative;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 9999px;
          color: var(--brand-primary);
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        
        .hero h1 {
          font-size: clamp(3rem, 8vw, 5.5rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
          max-width: 900px;
        }
        
        .hero p {
          font-size: clamp(1.1rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 600px;
          margin-bottom: 3rem;
          line-height: 1.6;
        }
        
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }
        
        .feature-card {
          padding: 2.5rem;
          text-align: left;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .glow-orb-primary, .glow-orb-secondary {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: -1;
          opacity: 0.25;
          mix-blend-mode: screen;
        }

        .glow-orb-primary {
          width: 50vw;
          height: 50vw;
          max-width: 600px;
          max-height: 600px;
          background: rgba(99, 102, 241, 0.6); /* Brand primary */
          top: -10%;
          left: -10%;
          animation: floatOrb 18s infinite ease-in-out alternate;
        }
        
        .glow-orb-secondary {
          width: 40vw;
          height: 40vw;
          max-width: 500px;
          max-height: 500px;
          background: rgba(168, 85, 247, 0.5); /* Brand secondary */
          bottom: -20%;
          right: -5%;
          animation: floatOrb2 22s infinite ease-in-out alternate;
        }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(6%, 12%) scale(1.1); }
          100% { transform: translate(-4%, -8%) scale(0.95); }
        }

        @keyframes floatOrb2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10%, -5%) scale(1.2); }
          100% { transform: translate(8%, 15%) scale(0.9); }
        }
      `}} />

      <section className="hero">
        <div className="glow-orb-primary"></div>
        <div className="glow-orb-secondary"></div>
        <div className="hero-badge animate-fade-up">Introducing CareerAI</div>
        <h1 className="animate-fade-up delay-100">
          Your Personal <br /> <span className="text-gradient">AI Career Assistant</span>
        </h1>
        <p className="animate-fade-up delay-200">
          Unlock your potential with AI-driven resume scoring, personalized learning paths, and intelligent job recommendations built just for you.
        </p>
        <div className="hero-actions animate-fade-up delay-300">
          <a href="/dashboard" className="btn-primary">Build Your Profile</a>
          <a href="#features" className="btn-secondary">Explore Features</a>
        </div>
      </section>

      <section id="features" className="section container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Everything You Need to Succeed</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            A powerful suite of AI tools designed to analyze your skills, bridge your gaps, and land your dream job.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon">📄</div>
            <h3>Resume Score & Polish</h3>
            <p>Our AI analyzes your resume and LinkedIn profile, scoring it out of 100, and provides actionable steps to stand out to recruiters.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">🎯</div>
            <h3>Skill Gap Analysis</h3>
            <p>Compare your current skills with industry standards. We find the exact missing skills and recommend the best courses to bridge the gap.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">💼</div>
            <h3>Smart Job Matches</h3>
            <p>Stop scrolling endlessly. Our recommendation engine finds jobs and internships tailored specifically to your skill set and career path.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">🎙️</div>
            <h3>AI Mock Interviews</h3>
            <p>Practice makes perfect. Generate custom, role-specific interview questions and get real-time feedback before the big day.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">🌐</div>
            <h3>Magic Portfolio</h3>
            <p>Instantly generate a beautiful, responsive portfolio website from your profile data to showcase your projects and skills.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">🔮</div>
            <h3>Career Path Predictor</h3>
            <p>Unsure what's next? Let our AI suggest roles like Data Scientist or Web Developer based on your unique interests and strengths.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How it Works</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Get started in minutes and track your progress straight to your dream job.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--brand-primary)', opacity: 0.5 }}>01</div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Upload Your Resume</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Start by uploading your current resume. Our AI will instantly analyze it, format it for ATS readability, and score your quantifiable impact.</p>
            </div>
          </div>
          
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--brand-primary)', opacity: 0.5 }}>02</div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Discover Skill Gaps</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Select your dream role. We cross-reference your resume against industry standards to identify exactly what skills you're missing.</p>
            </div>
          </div>

          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--brand-primary)', opacity: 0.5 }}>03</div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Learn & Apply</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Take recommended courses to fill those gaps. Once you're ready, apply directly to smart-matched jobs tailored specifically to your profile.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
