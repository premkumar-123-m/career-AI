'use client'

import { useState } from 'react';

export default function PortfolioClient({ user, initialPortfolio }: { user: any, initialPortfolio: any }) {
    const username = user.name.toLowerCase().replace(/\s+/g, '');
    
    // Parse dynamic resume data
    const resumeData = initialPortfolio?.resumeData ? JSON.parse(initialPortfolio.resumeData) : null;
    const dynamicSkills = resumeData?.skills || ['React', 'Next.js', 'Typescript', 'Node.js', 'TailwindCSS'];
    const dynamicRole = resumeData?.jobs?.[1] || user.jobMatches?.[0]?.title || 'Software Developer';
    const dynamicAbout = resumeData?.highlight || 'Passionate about building fast, accessible software solutions and crafting excellent user experiences using modern technologies.';
    const dynamicProjects = [
        { title: `Advanced ${dynamicRole.split(' ')[0]} Platform`, stack: dynamicSkills.slice(0,3).join(', ') },
        { title: 'AI Automation Dashboard', stack: `${dynamicSkills[0] || 'React'}, Prisma, Tailwind` }
    ];
    
    // State
    const [theme, setTheme] = useState(initialPortfolio?.theme || 'Minimalist');
    const [color, setColor] = useState(initialPortfolio?.color || '#6366f1');
    
    // Parse initial sections, fallback to all selected
    // Note: If sections is accidentally saved as JSON, reset to default array
    let defaultSections = ['About Me', 'Skills Graphic', 'Projects Sandbox', 'Experience'];
    if (initialPortfolio?.sections) {
        if (initialPortfolio.sections.startsWith('{')) {
            // It was accidentally corrupted with JSON in previous bug, fallback to default
        } else {
            defaultSections = initialPortfolio.sections.split(',').map((s: string) => s.trim());
        }
    }
        
    const [sections, setSections] = useState<string[]>(defaultSections);
    
    // Action states
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);

    const handleSectionToggle = (section: string) => {
        setSections(prev => 
            prev.includes(section) 
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Configuration saved to your profile!');
        }, 1000);
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            // Simulate ZIP download
            const blob = new Blob(['Mock Portfolio Source Code'], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${username}-portfolio-source.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 1500);
    };

    const handleDeploy = () => {
        setIsDeploying(true);
        setTimeout(() => {
            setIsDeploying(false);
            window.open(`https://vercel.com/new`, '_blank');
        }, 2000);
    };

    // Theme Styles Mapping
    const getThemeStyles = () => {
        switch (theme) {
            case 'Developer Dark':
                return { bg: '#0f172a', text: '#f8fafc', cardBg: '#1e293b', cardBorder: '#334155', accentText: color };
            case 'Creative':
                return { bg: '#fdf4ff', text: '#4a044e', cardBg: '#ffffff', cardBorder: color, accentText: color };
            case 'Corporate':
                return { bg: '#ffffff', text: '#1e293b', cardBg: '#f8fafc', cardBorder: '#e2e8f0', accentText: color };
            case 'Minimalist':
            default:
                return { bg: '#ffffff', text: '#0f172a', cardBg: '#f8fafc', cardBorder: '#e2e8f0', accentText: color };
        }
    };

    const previewStyles = getThemeStyles();

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '0 0 2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Magic Portfolio Builder</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Instantly create a professional, static web portfolio using your AI-analyzed resume data.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        className="btn-secondary" 
                        onClick={handleExport}
                        disabled={isExporting}
                        style={{ opacity: isExporting ? 0.7 : 1 }}
                    >
                        {isExporting ? 'Zipping...' : 'Export ZIP'}
                    </button>
                    <button 
                        className="btn-primary" 
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        style={{ opacity: isDeploying ? 0.7 : 1 }}
                    >
                        {isDeploying ? 'Deploying...' : 'Deploy to Vercel'}
                    </button>
                </div>
            </div>

            <div className="split-layout">
                {/* Controls Panel */}
                <div className="controls-panel glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', fontWeight: 600 }}>Customization</h3>

                    <div className="control-group">
                        <label className="control-label">Select Theme</label>
                        <div className="theme-selector">
                            {['Minimalist', 'Developer Dark', 'Creative', 'Corporate'].map(t => (
                                <button 
                                    key={t} 
                                    className={`theme-btn ${theme === t ? 'active' : ''}`}
                                    onClick={() => setTheme(t)}
                                    style={theme === t ? { borderColor: color, background: `${color}15` } : {}}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.5rem' }}>
                        <label className="control-label">Primary Color</label>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6', '#0ea5e9'].map(c => (
                                <div 
                                    key={c} 
                                    onClick={() => setColor(c)}
                                    style={{ 
                                        width: '32px', height: '32px', borderRadius: '50%', 
                                        background: c, cursor: 'pointer', 
                                        border: c === color ? '3px solid white' : '2px solid transparent',
                                        boxShadow: c === color ? `0 0 0 2px ${c}` : 'none'
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.5rem' }}>
                        <label className="control-label">Included Sections</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['About Me', 'Skills Graphic', 'Projects Sandbox', 'Experience'].map(sec => (
                                <label key={sec} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={sections.includes(sec)} 
                                        onChange={() => handleSectionToggle(sec)}
                                        style={{ transform: 'scale(1.2)' }}
                                    /> 
                                    {sec}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', marginTop: '2rem', opacity: isSaving ? 0.7 : 1 }}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>

                {/* Live Preview Panel */}
                <div className="preview-panel" style={{ background: previewStyles.bg, transition: 'background 0.3s ease' }}>
                    <div className="mockup-header">
                        <div className="mockup-dot" style={{ background: '#ef4444' }}></div>
                        <div className="mockup-dot" style={{ background: '#eab308' }}></div>
                        <div className="mockup-dot" style={{ background: '#22c55e' }}></div>
                        <div style={{ margin: '0 auto', fontSize: '0.75rem', color: '#64748b', background: '#e2e8f0', padding: '0.25rem 2rem', borderRadius: '4px' }}>
                            {username}-portfolio.vercel.app
                        </div>
                    </div>

                    <div className="mockup-body" style={{ color: previewStyles.text, transition: 'color 0.3s ease' }}>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', color: previewStyles.accentText, transition: 'color 0.3s ease' }}>
                                {user.name.split(' ').map((n: string) => n[0]).join('')}.
                            </h2>
                            <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 500, opacity: 0.8 }}>
                                {sections.includes('Projects Sandbox') && <span>Work</span>}
                                {sections.includes('About Me') && <span>About</span>}
                                <span>Contact</span>
                            </nav>
                        </header>

                        <div style={{ maxWidth: '600px', marginBottom: '4rem' }}>
                            <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                                Hi, I'm {user.name.split(' ')[0]}.<br />
                                <span style={{ color: previewStyles.accentText, transition: 'color 0.3s ease' }}>
                                    {dynamicRole}
                                </span>
                            </h1>
                            {sections.includes('About Me') && (
                                <p style={{ fontSize: '1.125rem', lineHeight: 1.6, opacity: 0.8 }}>
                                    {dynamicAbout}
                                </p>
                            )}
                        </div>

                        {sections.includes('Skills Graphic') && (
                            <div style={{ marginBottom: '4rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Core Technologies</h3>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {dynamicSkills.map((skill: string) => (
                                        <span key={skill} style={{ 
                                            padding: '0.5rem 1rem', 
                                            background: previewStyles.cardBg, 
                                            border: `1px solid ${previewStyles.cardBorder}`,
                                            borderRadius: '999px',
                                            fontSize: '0.875rem',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {sections.includes('Projects Sandbox') && (
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Selected Projects</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    {dynamicProjects.map((proj, i) => (
                                        <div key={i} style={{ 
                                            background: previewStyles.cardBg, 
                                            border: `1px solid ${previewStyles.cardBorder}`, 
                                            borderRadius: '12px', 
                                            padding: '1.5rem',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <div style={{ width: '100%', height: '150px', background: `${previewStyles.accentText}20`, borderRadius: '8px', marginBottom: '1rem' }}></div>
                                            <h4 style={{ fontWeight: 600 }}>{proj.title}</h4>
                                            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>{proj.stack}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {sections.includes('Experience') && (
                            <div style={{ marginTop: '4rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Experience</h3>
                                <div style={{ 
                                    background: previewStyles.cardBg, 
                                    border: `1px solid ${previewStyles.cardBorder}`, 
                                    borderRadius: '12px', 
                                    padding: '1.5rem',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <h4 style={{ fontWeight: 600, fontSize: '1.125rem' }}>Senior Developer <span style={{color: previewStyles.accentText}}>@ TechCorp</span></h4>
                                    <p style={{ fontSize: '0.875rem', opacity: 0.6, marginBottom: '1rem' }}>2021 - Present</p>
                                    <ul style={{ paddingLeft: '1.5rem', opacity: 0.8, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <li>Spearheaded development of core web vitals, resulting in a 40% performance increase.</li>
                                        <li>Led a team of 5 engineers to deliver 3 major product features on schedule.</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
