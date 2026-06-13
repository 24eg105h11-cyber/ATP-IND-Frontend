import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import CodePlayground from './components/CodePlayground'
import LoginPage from './components/LoginPage'
import RegistrationPage from './components/RegistrationPage'
import HomePage from './components/HomePage'
import ProfilePage from './components/ProfilePage'
import LandingPage from './components/LandingPage'
import StudyPlanPage from './components/StudyPlanPage'
import AdminPage from './components/AdminPage'
import { useAuth } from './store/authStore'
import './index.css'

function App() {
  const { isAuthenticated, checkAuth, loading, logout, currentUser } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#e2e8f0' }}>
        {isAuthenticated && (
          <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 40px', 
            backgroundColor: '#0f172a', 
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <Link to="/" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: '24px', 
                fontWeight: '800',
                letterSpacing: '-1.5px',
                background: 'linear-gradient(to right, #00ffcc, #3399ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                fontFamily: "'Syne', sans-serif"
              }}>KENSEI</Link>
              <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
              <Link to="/study-plan" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '600' }}>Study Plan</Link>
              {currentUser?.role === 'admin' && (
                <Link to="/admin" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '600' }}>Admin</Link>
              )}
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link to="/profile" style={{ 
                color: '#cbd5e1', 
                textDecoration: 'none', 
                fontWeight: '600',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>Profile ({currentUser?.username})</Link>
              <button 
                onClick={logout}
                style={{ 
                  padding: '8px 20px', 
                  backgroundColor: '#ef4444', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
                }}
              >
                Logout
              </button>
            </div>
          </nav>
        )}
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegistrationPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <HomePage /> : <LandingPage />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/study-plan" 
            element={isAuthenticated ? <StudyPlanPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/playground/:problemId?" 
            element={isAuthenticated ? <CodePlayground /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={isAuthenticated && currentUser?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

