import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/authStore';

const RegistrationPage = () => {
    const ADMIN_CODE = 'admin123';
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
        adminCode: ''
    });
    const [localError, setLocalError] = useState('');
    const navigate = useNavigate();
    const { signup, loading, error: authError } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        // Validate admin code if registering as admin
        if (formData.role === 'admin') {
            if (!formData.adminCode) {
                setLocalError('Admin code is required to register as an administrator');
                return;
            }
            if (formData.adminCode !== ADMIN_CODE) {
                setLocalError('Invalid admin code. Please contact the platform owner.');
                return;
            }
        }

        try {
            // Don't send adminCode to backend
            const submitData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };
            await signup(submitData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setLocalError(err.message || 'Registration failed');
        }
    };

    const displayError = localError || authError;

    return (
                <div className="registration-page">
                        <style>{css}</style>
                        <div className="registration-background">
                                <span className="orb orb-one" />
                                <span className="orb orb-two" />
                                <span className="orb orb-three" />
                                <span className="grid-overlay" />
                        </div>

                        <div className="registration-shell">
                                <div className="registration-panel registration-panel--left">
                                        <p className="eyebrow">Join the platform</p>
                                        <h2 className="hero-title">Create an account and start solving with confidence.</h2>
                                        <p className="hero-copy">
                                                Build your profile, save progress, and practice coding in a space designed for focus.
                                        </p>

                                        <div className="feature-list">
                                                <div className="feature-card">
                                                        <span className="feature-dot" />
                                                        Curated coding challenges
                                                </div>
                                                <div className="feature-card">
                                                        <span className="feature-dot" />
                                                        Track your submissions and progress
                                                </div>
                                                <div className="feature-card">
                                                        <span className="feature-dot" />
                                                        Profile tools and leaderboard support
                                                </div>
                                        </div>

                                        <div className="mini-banner">
                                                <span className="mini-banner__label">Tip</span>
                                                <span className="mini-banner__text">Use a strong password and a real email to keep your account secure.</span>
                                        </div>
                                </div>

                                <div className="registration-panel registration-panel--right">
                                        <div className="form-header">
                                                <h3>Create an Account</h3>
                                                <p>Sign up in a few quick steps.</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="registration-form">
                                                <div className="input-group">
                                                        <label htmlFor="username">Username</label>
                                                        <input
                                                                id="username"
                                                                type="text"
                                                                name="username"
                                                                value={formData.username}
                                                                onChange={handleChange}
                                                                required
                                                                className="input"
                                                                placeholder="Choose a username"
                                                        />
                                                </div>

                                                <div className="input-group">
                                                        <label htmlFor="email">Email</label>
                                                        <input
                                                                id="email"
                                                                type="email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                required
                                                                className="input"
                                                                placeholder="Enter your email"
                                                        />
                                                </div>

                                                <div className="input-group">
                                                        <label htmlFor="password">Password</label>
                                                        <input
                                                                id="password"
                                                                type="password"
                                                                name="password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                required
                                                                className="input"
                                                                placeholder="Create a password"
                                                        />
                                                </div>

                                                <div className="input-group">
                                                        <label htmlFor="role">Account Type</label>
                                                        <select
                                                                id="role"
                                                                name="role"
                                                                value={formData.role}
                                                                onChange={handleChange}
                                                                className="input"
                                                        >
                                                                <option value="user">Regular User</option>
                                                                <option value="admin">Administrator</option>
                                                        </select>
                                                </div>

                                                {formData.role === 'admin' && (
                                                        <div className="input-group">
                                                                <label htmlFor="adminCode">Admin Code</label>
                                                                <input
                                                                        id="adminCode"
                                                                        type="password"
                                                                        name="adminCode"
                                                                        value={formData.adminCode}
                                                                        onChange={handleChange}
                                                                        required
                                                                        className="input"
                                                                        placeholder="Enter admin code"
                                                                />
                                                                <small style={{ color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                                                                        You must have the admin code to register as an administrator.
                                                                </small>
                                                        </div>
                                                )}

                                                {displayError && <p className="error-box">{displayError}</p>}

                                                <button type="submit" disabled={loading} className="submit-button">
                                                        {loading ? 'Creating account...' : 'Sign Up'}
                                                </button>

                                                <p className="login-link">
                                                        Already have an account? <Link to="/login">Login here</Link>
                                                </p>
                                        </form>
                                </div>
            </div>
        </div>
    );
};

const css = `
    .registration-page {
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px 20px;
        background:
            radial-gradient(circle at top left, rgba(45, 212, 191, 0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.2), transparent 24%),
            linear-gradient(135deg, #09111f 0%, #0f172a 50%, #101a34 100%);
        color: #e2e8f0;
    }

    .registration-background {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .grid-overlay {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
        background-size: 44px 44px;
        mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent 80%);
    }

    .orb {
        position: absolute;
        border-radius: 999px;
        filter: blur(12px);
        animation: float 12s ease-in-out infinite;
    }

    .orb-one {
        width: 220px;
        height: 220px;
        top: -50px;
        left: -20px;
        background: rgba(45, 212, 191, 0.18);
    }

    .orb-two {
        width: 180px;
        height: 180px;
        right: 10%;
        top: 12%;
        background: rgba(59, 130, 246, 0.16);
        animation-delay: -4s;
    }

    .orb-three {
        width: 160px;
        height: 160px;
        left: 12%;
        bottom: 10%;
        background: rgba(251, 146, 60, 0.14);
        animation-delay: -7s;
    }

    .registration-shell {
        position: relative;
        z-index: 1;
        width: min(1120px, 100%);
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        gap: 24px;
        align-items: stretch;
    }

    .registration-panel {
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(15, 23, 42, 0.72);
        backdrop-filter: blur(18px);
        border-radius: 28px;
        box-shadow: 0 30px 80px rgba(2, 6, 23, 0.45);
    }

    .registration-panel--left {
        padding: 44px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .registration-panel--left::after {
        content: '';
        position: absolute;
        inset: auto -60px -100px auto;
        width: 220px;
        height: 220px;
        background: radial-gradient(circle, rgba(45, 212, 191, 0.18), transparent 65%);
        transform: rotate(15deg);
    }

    .eyebrow {
        display: inline-flex;
        align-self: flex-start;
        padding: 8px 14px;
        border-radius: 999px;
        background: rgba(45, 212, 191, 0.12);
        color: #5eead4;
        border: 1px solid rgba(45, 212, 191, 0.18);
        font-size: 12px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        margin: 0 0 18px;
    }

    .hero-title {
        font-size: clamp(2.2rem, 4vw, 4rem);
        line-height: 1.02;
        margin: 0 0 18px;
        color: #f8fafc;
        max-width: 11ch;
    }

    .hero-copy {
        margin: 0 0 28px;
        color: #cbd5e1;
        font-size: 1.02rem;
        line-height: 1.7;
        max-width: 56ch;
    }

    .feature-list {
        display: grid;
        gap: 12px;
        margin-bottom: 24px;
    }

    .feature-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(148, 163, 184, 0.14);
        color: #e2e8f0;
    }

    .feature-dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2dd4bf, #60a5fa);
        box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.12);
        flex-shrink: 0;
    }

    .mini-banner {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 16px 18px;
        border-radius: 18px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(45, 212, 191, 0.08));
        border: 1px solid rgba(96, 165, 250, 0.16);
    }

    .mini-banner__label {
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #e2e8f0;
    }

    .mini-banner__text {
        color: #cbd5e1;
        line-height: 1.5;
    }

    .registration-panel--right {
        padding: 36px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        animation: riseIn 0.7s ease both;
    }

    .form-header {
        margin-bottom: 22px;
    }

    .form-header h3 {
        margin: 0 0 8px;
        color: #f8fafc;
        font-size: 1.6rem;
    }

    .form-header p {
        margin: 0;
        color: #94a3b8;
    }

    .registration-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .input-group label {
        color: #cbd5e1;
        font-size: 14px;
        font-weight: 600;
    }

    .input {
        width: 100%;
        padding: 14px 16px;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(2, 6, 23, 0.4);
        color: #f8fafc;
        font-size: 15px;
        outline: none;
        transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
    }

    .input::placeholder {
        color: #64748b;
    }

    .input:focus {
        border-color: rgba(45, 212, 191, 0.9);
        box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.12);
        background: rgba(2, 6, 23, 0.52);
        transform: translateY(-1px);
    }

    .input option {
        background: #0f172a;
        color: #f8fafc;
    }

    .error-box {
        margin: 0;
        padding: 12px 14px;
        border-radius: 14px;
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.22);
        color: #fecaca;
        font-size: 14px;
    }

    .submit-button {
        padding: 14px 18px;
        border: none;
        border-radius: 14px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 700;
        color: white;
        background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%);
        box-shadow: 0 14px 28px rgba(20, 184, 166, 0.25);
        transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
    }

    .submit-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 18px 34px rgba(59, 130, 246, 0.28);
        filter: brightness(1.05);
    }

    .submit-button:disabled {
        cursor: not-allowed;
        opacity: 0.75;
        box-shadow: none;
    }

    .login-link {
        text-align: center;
        margin: 4px 0 0;
        color: #94a3b8;
    }

    .login-link a {
        color: #5eead4;
        text-decoration: none;
        font-weight: 700;
    }

    .login-link a:hover {
        text-decoration: underline;
    }

    @keyframes float {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(0, -12px, 0) scale(1.04); }
    }

    @keyframes riseIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 980px) {
        .registration-shell {
            grid-template-columns: 1fr;
        }

        .registration-panel--left {
            padding-bottom: 28px;
        }
    }

    @media (max-width: 640px) {
        .registration-page {
            padding: 18px 14px;
        }

        .registration-panel--left,
        .registration-panel--right {
            padding: 24px;
            border-radius: 22px;
        }

        .hero-title {
            max-width: none;
        }
    }
`;

export default RegistrationPage;
