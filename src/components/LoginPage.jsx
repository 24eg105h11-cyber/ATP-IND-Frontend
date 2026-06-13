import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/authStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setLocalError(err.message || 'Login failed');
    }
  };

  const displayError = localError || authError;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundShapes}>
        <div style={{...styles.shape, top: '10%', left: '10%', width: '300px', height: '300px', backgroundColor: 'rgba(0, 123, 255, 0.1)'}}></div>
        <div style={{...styles.shape, bottom: '10%', right: '10%', width: '400px', height: '400px', backgroundColor: 'rgba(40, 167, 69, 0.1)'}}></div>
      </div>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{
            fontSize: '36px',
            fontWeight: '800',
            letterSpacing: '-2px',
            background: 'linear-gradient(to right, #00ffcc, #3399ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            fontFamily: "'Syne', sans-serif"
          }}>KENSEI</div>
          <h2 style={{...styles.title, fontFamily: "'Syne', sans-serif"}}>Welcome Back</h2>
          <p style={styles.subtitle}>Log in to continue your coding journey</p>
        </div>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="name@company.com"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </div>
          {displayError && (
            <div style={styles.errorContainer}>
              <span style={styles.errorText}>{displayError}</span>
            </div>
          )}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? (
              <span style={styles.loadingWrapper}>
                <div style={styles.spinner}></div>
                Logging in...
              </span>
            ) : 'Login to Dashboard'}
          </button>
          <div style={styles.footer}>
            Don't have an account? <Link to="/register" style={styles.link}>Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0f172a',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0
  },
  shape: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'gradient 15s ease infinite',
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(12px)',
    padding: '48px',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 1,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logo: {
    fontSize: '42px',
    fontWeight: '800',
    background: 'linear-gradient(to right, #00d2ff, #92fe9d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: '-2px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#f8fafc',
    margin: '0 0 8px 0',
    letterSpacing: '-0.025em'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '16px',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#cbd5e1',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    fontSize: '16px',
    transition: 'all 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  },
  button: {
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
    transition: 'all 0.2s',
    marginTop: '8px',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.2)'
  },
  errorText: {
    color: '#f87171',
    fontSize: '14px',
    textAlign: 'center',
    display: 'block'
  },
  footer: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '15px'
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    marginLeft: '4px'}
  };

export default LoginPage;
