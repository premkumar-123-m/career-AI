'use client'

import { useState } from 'react';

export default function AlertPreferencesClient() {
    const [isOpen, setIsOpen] = useState(false);
    const [preferences, setPreferences] = useState({
        emailAlerts: true,
        pushNotifications: false,
        weeklyDigest: true,
        newJobMatches: true,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setIsOpen(false);
            // Optional: show a toast notification here
        }, 800);
    };

    return (
        <>
            <button className="btn-secondary" onClick={() => setIsOpen(true)}>
                ⚙️ Alert Preferences
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="glass-panel animate-fade-up" style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '2rem',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={() => setIsOpen(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.25rem', cursor: 'pointer' }}
                        >
                            ×
                        </button>
                        
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Alert Preferences</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <span>Email Alerts</span>
                                <input type="checkbox" checked={preferences.emailAlerts} onChange={() => handleToggle('emailAlerts')} style={{ transform: 'scale(1.2)' }} />
                            </label>
                            
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <span>Push Notifications</span>
                                <input type="checkbox" checked={preferences.pushNotifications} onChange={() => handleToggle('pushNotifications')} style={{ transform: 'scale(1.2)' }} />
                            </label>
                            
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <span>Weekly Digest</span>
                                <input type="checkbox" checked={preferences.weeklyDigest} onChange={() => handleToggle('weeklyDigest')} style={{ transform: 'scale(1.2)' }} />
                            </label>
                            
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <span>New Job Matches</span>
                                <input type="checkbox" checked={preferences.newJobMatches} onChange={() => handleToggle('newJobMatches')} style={{ transform: 'scale(1.2)' }} />
                            </label>
                        </div>
                        
                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', opacity: isSaving ? 0.7 : 1 }}
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
