'use client'

import { useState } from 'react';

export default function FileUploadZone() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            
            // Simulate upload process
            setIsUploading(true);
            setTimeout(() => {
                setIsUploading(false);
                setIsDone(true);
                // Optionally clear the state after a while to allow another upload
                setTimeout(() => {
                    setIsDone(false);
                    setFile(null);
                }, 3000);
            }, 2000);
        }
    };

    return (
        <div className="upload-zone">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Drag & Drop your Resume</h3>
            
            {isUploading ? (
                <div style={{ padding: '1rem' }}>
                    <p style={{ color: 'var(--brand-primary)', fontWeight: 'bold', marginBottom: '0.5rem', wordBreak: 'break-all' }}>Uploading {file?.name}...</p>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '50%', height: '100%', background: 'var(--brand-primary)', animation: 'pulse 1s infinite' }} />
                    </div>
                </div>
            ) : isDone ? (
                <div style={{ padding: '1rem' }}>
                    <p style={{ color: '#10b981', fontWeight: 'bold', wordBreak: 'break-all' }}>✅ {file?.name} uploaded successfully!</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>AI evaluation complete.</p>
                </div>
            ) : (
                <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Supports PDF, DOCX (Max 5MB)</p>
                    <label className="btn-secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
                        Browse Files
                        <input type="file" accept=".pdf,.docx,.doc" style={{ display: 'none' }} onChange={handleFileChange} />
                    </label>
                </>
            )}
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse {
                    0% { width: 0%; transform: translateX(-100%); }
                    100% { width: 100%; transform: translateX(100%); }
                }
            `}} />
        </div>
    );
}
