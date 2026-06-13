import React from 'react';

const ProfileFormCard = ({
    currentUser,
    formData,
    setFormData,
    handleSubmit,
    loading,
    message,
    authError
}) => {
    return (
        <section style={cardStyle}>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                <FieldGroup label="Username">
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        style={inputStyle}
                    />
                </FieldGroup>

                <FieldGroup label="Email">
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={inputStyle}
                    />
                </FieldGroup>

                <FieldGroup label="Role">
                    <input
                        type="text"
                        value={currentUser?.role || ''}
                        disabled
                        style={{ ...inputStyle, backgroundColor: '#eef2ff', cursor: 'not-allowed', color: '#475569' }}
                    />
                </FieldGroup>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
                    <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Edit your public identity and keep your profile sharp.</span>
                </div>

                {message && <p style={successTextStyle}>{message}</p>}
                {authError && <p style={errorTextStyle}>{authError}</p>}
            </form>
        </section>
    );
};

const FieldGroup = ({ label, children }) => (
    <div style={{ display: 'grid', gap: '8px' }}>
        <label style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.92rem' }}>{label}</label>
        {children}
    </div>
);

const cardStyle = {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(148,163,184,0.22)',
    boxShadow: '0 24px 60px rgba(15,23,42,0.08)',
    borderRadius: '24px',
    padding: '24px'
};

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid rgba(148,163,184,0.3)',
    backgroundColor: '#fff',
    fontSize: '0.98rem',
    color: '#0f172a',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(15,23,42,0.04)'
};

const buttonStyle = (loading) => ({
    padding: '12px 18px',
    background: loading ? 'linear-gradient(135deg, #94a3b8, #64748b)' : 'linear-gradient(135deg, #2563eb, #0f172a)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontWeight: 800,
    letterSpacing: '0.01em',
    boxShadow: '0 16px 28px rgba(37,99,235,0.18)'
});

const successTextStyle = {
    margin: 0,
    color: '#15803d',
    backgroundColor: '#ecfdf5',
    border: '1px solid #bbf7d0',
    padding: '10px 12px',
    borderRadius: '12px'
};

const errorTextStyle = {
    margin: 0,
    color: '#b91c1c',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    padding: '10px 12px',
    borderRadius: '12px'
};

export default ProfileFormCard;
