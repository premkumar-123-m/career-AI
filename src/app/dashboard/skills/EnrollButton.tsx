'use client'

export default function EnrollButton({ skill }: { skill: string }) {
    const handleEnroll = () => {
        // Construct search URL for the course
        const query = encodeURIComponent(`${skill} course certification`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    };

    return (
        <button 
            className="btn-secondary" 
            style={{ padding: '0.25rem 1rem', fontSize: '0.875rem' }}
            onClick={handleEnroll}
        >
            Enroll
        </button>
    );
}

