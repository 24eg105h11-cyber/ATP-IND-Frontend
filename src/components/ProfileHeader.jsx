import React from 'react';

const ProfileHeader = ({ currentUser, joinedLabel, solvedCount }) => {
    return (
        <div style={{ marginBottom: '24px' }}>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.78rem' }}>Account</p>
            <h2 style={{ margin: '8px 0 10px', fontSize: '2.4rem', lineHeight: 1.05, color: '#0f172a', letterSpacing: '-0.04em' }}>Profile control center</h2>
            <p style={{ margin: 0, color: '#475569', maxWidth: '720px' }}>Review your account details, track your progress, and keep your coding identity polished.</p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
                <Pill label={currentUser?.role || 'user'} highlight={currentUser?.role === 'admin'} />
                <Pill label={`Joined ${joinedLabel}`} />
                <Pill label={`${solvedCount} solved`} />
            </div>
        </div>
    );
};

const Pill = ({ label, highlight = false }) => (
    <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '999px',
        background: highlight ? 'linear-gradient(135deg, #0f172a, #334155)' : 'linear-gradient(135deg, #dbeafe, #eff6ff)',
        color: highlight ? '#fff' : '#1d4ed8',
        fontWeight: 700,
        fontSize: '0.84rem',
        textTransform: 'capitalize',
        boxShadow: '0 10px 24px rgba(15,23,42,0.06)'
    }}>
        {label}
    </span>
);

export default ProfileHeader;
