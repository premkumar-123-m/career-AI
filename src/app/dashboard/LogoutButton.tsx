'use client'

import { logoutUser } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await logoutUser();
        router.push('/');
        router.refresh();
    };

    return (
        <button 
            onClick={handleLogout}
            style={{ 
                width: '100%', 
                padding: '0.75rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
            <span style={{ fontSize: '1.2rem' }}>🚪</span> Logout
        </button>
    );
}
