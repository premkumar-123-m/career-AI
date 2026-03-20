'use client'

export default function GeneratePDFButton() {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My CareerAI Resume Analysis',
                    text: 'Check out my resume analysis and scores on CareerAI!',
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={handleShare}>
                <span style={{ marginRight: '0.5rem' }}>🔗</span> Share
            </button>
            <button className="btn-primary" onClick={() => window.print()}>
                Generate PDF
            </button>
        </div>
    )
}
