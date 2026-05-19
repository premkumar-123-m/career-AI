import Image from 'next/image';

export default function Home() {
  return (
    <div className="page-wrapper" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .hero {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          padding: 6rem 2rem 4rem;
          position: relative;
        }
        
        .hero-content {
          flex: 1;
          max-width: 600px;
          text-align: left;
        }
        
        .hero-image-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          color: var(--brand-accent);
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }
        
        .hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        
        .hero p {
          font-size: clamp(1.1rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          margin-bottom: 3rem;
          line-height: 1.6;
        }
        
        .hero-actions {
          display: flex;
          gap: 1rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }
        
        .feature-card {
          padding: 2.5rem;
          text-align: left;
          /* Handled by globals.css */
        }

        .feature-image {
          width: 100%;
          height: 200px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
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
        
        @media (max-width: 900px) {
           .hero {
             flex-direction: column;
             text-align: center;
           }
           .hero-content {
             margin-bottom: 3rem;
           }
           .hero-actions {
             justify-content: center;
           }
        }
      `}} />

      <section className="hero container">
        <div className="hero-content">
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
        </div>
        <div className="hero-image-wrapper animate-fade-up delay-300">
           <Image src="/images/hero.png" alt="AI Career Dashboard" width={500} height={500} style={{ width: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
        </div>
      </section>

      <section id="features" className="section container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Everything You Need to Succeed</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            A powerful suite of AI tools designed to analyze your skills, bridge your gaps, and land your dream job.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-image">
               <Image src="/images/feature.png" alt="Resume Analysis" fill style={{ objectFit: 'cover' }} />
            </div>
            <h3>Resume Score & Polish</h3>
            <p>Our AI analyzes your resume and LinkedIn profile, scoring it out of 100, and provides actionable steps to stand out to recruiters.</p>
          </div>
          <div className="feature-card">
             <div className="feature-image">
                <span style={{ fontSize: '4rem' }}>🎯</span>
             </div>
            <h3>Skill Gap Analysis</h3>
            <p>Compare your current skills with industry standards. We find the exact missing skills and recommend the best courses to bridge the gap.</p>
          </div>
          <div className="feature-card">
            <div className="feature-image">
               <span style={{ fontSize: '4rem' }}>💼</span>
            </div>
            <h3>Smart Job Matches</h3>
            <p>Stop scrolling endlessly. Our recommendation engine finds jobs and internships tailored specifically to your skill set and career path.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section container" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>How it Works</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Get started in minutes and track your progress straight to your dream job.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div className="feature-card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', flexDirection: 'row' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--brand-primary)', opacity: 0.3 }}>01</div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Upload Your Resume</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Start by uploading your current resume. Our AI will instantly analyze it, format it for ATS readability, and score your quantifiable impact.</p>
            </div>
          </div>
          
          <div className="feature-card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', flexDirection: 'row' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--brand-primary)', opacity: 0.3 }}>02</div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Discover Skill Gaps</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Select your dream role. We cross-reference your resume against industry standards to identify exactly what skills you're missing.</p>
            </div>
          </div>

          <div className="feature-card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', flexDirection: 'row' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--brand-primary)', opacity: 0.3 }}>03</div>
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
