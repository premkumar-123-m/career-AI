'use client'

import { useState } from 'react';
import { updateUserProfile } from '@/app/actions';

export default function EditableProfile({ user }: { user: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [role, setRole] = useState(user.role);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateUserProfile(user.id, name, role);
        if (res.success) {
            setIsEditing(false);
        } else {
            alert('Failed to update profile');
        }
        setIsSaving(false);
    };

    const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className="user-profile" style={{ flexWrap: 'wrap' }}>
            <div className="avatar">{initials}</div>
            <div style={{ flex: 1 }}>
                {!isEditing ? (
                    <>
                        <div style={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {name}
                            <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>✏️</button>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{role}</div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            style={{ width: '100%', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-light)', background: 'var(--bg-dark)', color: 'white', fontSize: '0.875rem' }}
                        />
                        <input 
                            type="text" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            style={{ width: '100%', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-light)', background: 'var(--bg-dark)', color: 'white', fontSize: '0.875rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleSave} disabled={isSaving} style={{ background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem', flex: 1 }}>{isSaving ? 'Saving...' : 'Save'}</button>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'var(--bg-card-hover)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem', flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
