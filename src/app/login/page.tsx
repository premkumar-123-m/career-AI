'use client'

import { useState } from 'react';
import { loginUser } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('email', formData.email);
        data.append('password', formData.password);

        const res = await loginUser(data);
        if (res.success) {
            router.push('/dashboard');
            router.refresh();
        } else {
            setError(res.error || 'Failed to login');
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <style dangerouslySetInnerHTML={{
                __html: `
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: var(--bg-dark);
          padding: 2rem;
        }

        .auth-panel {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 450px;
          padding: 3rem;
        }

        .glow-orb {
          position: absolute;
          width: 50vw;
          height: 50vw;
          max-width: 600px;
          max-height: 600px;
          background: var(--gradient-brand);
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          z-index: 0;
          animation: float 10s infinite ease-in-out alternate;
        }

        .auth-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 1rem;
          transition: var(--transition-normal);
          margin-bottom: 1.5rem;
        }

        .auth-input:focus {
          outline: none;
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: rgba(15, 23, 42, 0.8);
        }

        .auth-label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .auth-btn {
          width: 100%;
          padding: 1rem;
          margin-top: 1rem;
        }
      `}} />

            <div className="glow-orb" style={{ top: '20%', left: '10%' }}></div>
            <div className="glow-orb" style={{ bottom: '10%', right: '10%', background: 'var(--gradient-glow)', animationDelay: '-5s' }}></div>

            <div className="glass-panel auth-panel animate-fade-up">
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Log in to access your AI Career Dashboard.</p>
                </div>

                {error && (
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', color: '#fca5a5', marginBottom: '1.5rem', borderRadius: '4px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="auth-label">Email Address</label>
                        <input
                            type="email"
                            required
                            className="auth-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="auth-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Password
                            <Link href="/forgot-password" style={{ color: 'var(--brand-primary)', fontSize: '0.75rem' }}>Forgot?</Link>
                        </label>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="auth-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                style={{ marginBottom: 0, paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
                        <Link href="/register" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Create an account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
