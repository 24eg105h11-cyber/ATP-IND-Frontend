import React from 'react';

const ProfileSidebar = ({ currentUser, formData, solvedCount, chipStyle }) => {
    return (
        <aside style={{ display: 'grid', gap: '20px' }}>
            <section style={{
                ...glassPanelStyle,
                background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)'
            }}>
                <p style={sideKickerStyle}>Profile requirements</p>
                <h3 style={{ margin: '6px 0 12px', fontSize: '1.2rem' }}>Keep these items in shape</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                    <RequirementRow label="Valid email" value={formData.email ? 'Ready' : 'Missing'} active={!!formData.email} />
                    <RequirementRow label="Username set" value={formData.username ? 'Ready' : 'Missing'} active={!!formData.username} />
                    <RequirementRow label="Problem solving" value={`${solvedCount} completed`} active={solvedCount > 0} />
                    <RequirementRow label="Account role" value={currentUser?.role || 'user'} active />
                </div>
            </section>

            <section style={glassPanelStyle}>
                <p style={sideKickerStyle}>Solved problems</p>
                <h3 style={{ margin: '6px 0 12px', fontSize: '1.2rem', color: '#0f172a' }}>Your progress at a glance</h3>
                {solvedCount > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {currentUser.completedProblems.slice(0, 8).map((problemId, index) => (
                            <span key={`${problemId}-${index}`} style={chipStyle}>
                                #{index + 1}
                            </span>
                        ))}
                        {solvedCount > 8 && <span style={chipStyle}>+{solvedCount - 8} more</span>}
                    </div>
                ) : (
                    <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>No solved problems yet. Finish your first accepted submission and this panel will light up.</p>
                )}
            </section>
        </aside>
    );
};

const RequirementRow = ({ label, value, active }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '16px',
        backgroundColor: active ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)'
    }}>
        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{label}</span>
        <span style={{ color: active ? '#86efac' : '#fda4af', fontWeight: 800 }}>{value}</span>
    </div>
);

const glassPanelStyle = {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(148,163,184,0.22)',
    boxShadow: '0 24px 60px rgba(15,23,42,0.08)',
    borderRadius: '24px',
    padding: '22px'
};

const sideKickerStyle = {
    margin: 0,
    color: '#3b82f6',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '0.78rem'
};

export default ProfileSidebar;
