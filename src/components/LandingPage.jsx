import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.leftIllustration}>
          <div style={styles.heroCard}>
            <h2 style={styles.heroCardTitle}>Practice real coding problems in the browser.</h2>
            <p style={styles.heroCardText}>
              Write, run, and validate solutions with instant feedback using a built-in code playground.
            </p>
            <pre style={styles.codeSnippet}>{`function solve(nums) {
  return nums.map(n => n * 2);
}`}</pre>
          </div>
        </div>

        <div style={styles.content}>
          <h1 style={styles.title}>A New Way to Learn</h1>
          <p style={styles.subtitle}>
            LeetCode is the best platform to help you enhance your skills,
            expand your knowledge and prepare for technical interviews.
          </p>

          <div style={styles.actions}>
            <Link to="/register" style={styles.cta}>Create Account</Link>
            <Link to="/login" style={styles.secondary}>Sign in</Link>
          </div>
        </div>
      </div>

      <div style={styles.footerBand}>
        <div style={styles.exploreContainer}>
          <h3 style={styles.exploreTitle}>Start Exploring</h3>
          <p style={styles.exploreDesc}>
            Welcome to KENSEI — a learning platform where you can practice
            coding problems, track your progress, and prepare for technical interviews.
            Build skills with curated problems, an in-browser code editor, and instant feedback.
          </p>

          <ul style={styles.featureList}>
            <li style={styles.featureItem}>Curated problem sets across difficulty levels</li>
            <li style={styles.featureItem}>Live code playground with multiple languages</li>
            <li style={styles.featureItem}>Profile tracking and leaderboards</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #0f172a 0%, #0b1220 55%, #071022 100%)',
    color: 'white',
    overflow: 'hidden'
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '48px',
    padding: '80px 40px',
    width: '100%'
  },
  leftIllustration: {
    width: '560px',
    minHeight: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '18px',
    boxShadow: '0 40px 80px rgba(2,6,23,0.6)',
    background: 'linear-gradient(135deg, #0d1a36 0%, #172d4e 100%)'
  },
  heroCard: {
    width: '100%',
    padding: '32px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#e2e8f0',
  },
  heroCardTitle: {
    fontSize: '28px',
    margin: '0 0 12px',
    lineHeight: 1.2,
    fontWeight: 800
  },
  heroCardText: {
    color: '#cbd5e1',
    marginBottom: '20px',
    fontSize: '16px',
    lineHeight: 1.6
  },
  codeSnippet: {
    margin: 0,
    padding: '18px',
    borderRadius: '14px',
    background: 'rgba(17, 24, 39, 0.9)',
    color: '#d6deeb',
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    overflowX: 'auto'
  },
  content: {
    maxWidth: '640px',
    textAlign: 'left'
  },
  title: {
    fontSize: '48px',
    margin: 0,
    lineHeight: 1.05,
    fontWeight: 800,
    marginBottom: '16px'
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: '18px',
    marginBottom: '28px'
  },
  actions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  cta: {
    display: 'inline-block',
    padding: '12px 22px',
    backgroundColor: '#14b8a6',
    color: 'white',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: 700
  },
  secondary: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontWeight: 600
  },
  footerBand: {
    marginTop: 'auto',
    background: 'white',
    padding: '48px 20px',
    boxShadow: '0 -6px 30px rgba(2,6,23,0.06)'
  },
  exploreContainer: {
    maxWidth: '1100px',
    margin: '0 auto',
    color: '#0f172a'
  },
  exploreTitle: {
    fontSize: '22px',
    fontWeight: 800,
    marginBottom: '12px'
  },
  exploreDesc: {
    color: '#334155',
    fontSize: '16px',
    marginBottom: '16px',
    lineHeight: 1.5
  },
  featureList: {
    listStyle: 'disc',
    paddingLeft: '20px',
    color: '#0f172a'
  },
  featureItem: {
    marginBottom: '8px'
  }
};

export default LandingPage;
