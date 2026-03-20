import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'CareerAI | AI-Powered Career Guidance',
  description: 'AI-Powered Career Guidance & Job Recommendation Platform for students.',
};

import { getUserProfile } from './actions';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserProfile();

  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <nav className="main-nav">
          <div className="nav-container">
            <h1 className="logo text-gradient">CareerAI</h1>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it Works</a>
              {user ? (
                <a href="/dashboard" className="btn-primary">Dashboard</a>
              ) : (
                <>
                  <a href="/login" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Log In</a>
                  <a href="/register" className="btn-primary">Sign Up</a>
                </>
              )}
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
