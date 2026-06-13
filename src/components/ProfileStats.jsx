import React from 'react';

const ProfileStats = ({ solvedCount, completionRate, role }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <StatCard backgroundColor="#eff6ff" label="Solved" value={solvedCount} valueColor="#1d4ed8" />
            <StatCard backgroundColor="#ecfdf5" label="Completion" value={`${completionRate}%`} valueColor="#047857" />
            <StatCard backgroundColor="#fff7ed" label="Status" value={role === 'admin' ? 'Commander' : 'Rising solver'} valueColor="#c2410c" />
        </div>
    );
};

const StatCard = ({ backgroundColor, label, value, valueColor }) => (
    <div style={{
        backgroundColor,
        border: '1px solid rgba(148,163,184,0.18)',
        borderRadius: '18px',
        padding: '16px 14px',
        boxShadow: '0 12px 28px rgba(15,23,42,0.04)'
    }}>
        <div style={{
            fontSize: '0.8rem',
            color: '#64748b',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '8px'
        }}>
            {label}
        </div>
        <div style={{ color: valueColor, fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            {value}
        </div>
    </div>
);

export default ProfileStats;
