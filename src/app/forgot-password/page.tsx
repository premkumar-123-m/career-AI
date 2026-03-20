'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would typically call an API to send the reset link.
        // For now, we simulate success.
        setSubmitted(true);
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
                    <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reset Password</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter your email to receive a password reset link.</p>
                </div>

                {submitted ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid #10b981', color: '#6ee7b7', marginBottom: '1.5rem', borderRadius: '4px' }}>
                            If an account exists for {email}, a password reset link has been sent to it.
                        </div>
                        <Link href="/login" className="btn-primary auth-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="auth-label">Email Address</label>
                            <input
                                type="email"
                                required
                                className="auth-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-primary auth-btn">
                            Send Reset Link
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Remembered your password? </span>
                            <Link href="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Log In</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
