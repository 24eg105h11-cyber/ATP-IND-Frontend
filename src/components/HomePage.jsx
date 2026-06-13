import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authStore';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const { fetchProblems, fetchLeaderboard, currentUser } = useAuth();
    const [problems, setProblems] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedTopic, setSelectedTopic] = useState('all');
    const [problemsLoading, setProblemsLoading] = useState(true);
    const [problemsError, setProblemsError] = useState('');

    const formatTagLabel = (tag) => String(tag)
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const lb = await fetchLeaderboard();
                setLeaderboard(lb);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, [fetchLeaderboard]);

    useEffect(() => {
        const loadAvailableTags = async () => {
            try {
                const allProblems = await fetchProblems({});
                const tags = Array.from(
                    new Set(
                        allProblems.flatMap((problem) =>
                            (problem.tags || []).map((tag) => String(tag).trim().toLowerCase())
                        )
                    )
                ).sort();
                setAvailableTags(tags);
            } catch (err) {
                console.error('Failed to load tags', err);
                setAvailableTags([]);
            }
        };

        loadAvailableTags();
    }, [fetchProblems]);

    useEffect(() => {
        const loadData = async () => {
            setProblemsLoading(true);
            setProblemsError('');
            try {
                const filters = {};
                if (selectedDifficulty !== 'all') filters.difficulty = selectedDifficulty;
                if (selectedTopic !== 'all') filters.tag = selectedTopic;

                const probs = await fetchProblems(filters);
                setProblems(probs);
            } catch (err) {
                console.error(err);
                setProblems([]);
                setProblemsError('Unable to load problems from the backend. Check your API connection.');
            } finally {
                setProblemsLoading(false);
            }
        };
        loadData();
    }, [fetchProblems, selectedDifficulty, selectedTopic]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

    const difficultyOptions = [
        { value: 'all', label: 'All Levels' },
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
    ];

    return (
        <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '40px 20px', color: '#e2e8f0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '800', 
                        color: '#e2e8f0', 
                        marginBottom: '10px', 
                        fontFamily: "'Syne', sans-serif", 
                        letterSpacing: '-3px', 
                        background: 'linear-gradient(to right, #00ffcc, #3399ff, #00ffcc)', 
                        backgroundSize: '200% auto',
                        animation: 'gradient 4s linear infinite',
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent' 
                    }}>KENSEI</h1>
                    <p style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: '500', fontFamily: "'Sora', sans-serif" }}>Master the Code. Conquer the Challenges.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '40px' }}>
                    {/* Problems Section */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <div>
                                        <h2 style={{ fontSize: '1.5rem', color: '#e2e8f0', margin: '0 0 6px 0' }}>Challenges</h2>
                                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                            {problemsLoading ? 'Loading problems...' : `${problems.length} tasks available`}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {difficultyOptions.map((option) => {
                                                const isActive = selectedDifficulty === option.value;
                                                return (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => setSelectedDifficulty(option.value)}
                                                        style={{
                                                            border: '1px solid',
                                                            borderColor: isActive ? '#3b82f6' : '#334155',
                                                            backgroundColor: isActive ? '#3b82f6' : '#111827',
                                                            color: isActive ? '#fff' : '#cbd5e1',
                                                            padding: '8px 14px',
                                                            borderRadius: '999px',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            boxShadow: isActive ? '0 8px 18px rgba(59,130,246,0.22)' : 'none'
                                                        }}
                                                    >
                                                        {option.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            <button
                                                onClick={() => setSelectedTopic('all')}
                                                style={{
                                                    padding: '10px 16px',
                                                    borderRadius: '999px',
                                                    border: selectedTopic === 'all' ? '1px solid #3b82f6' : '1px solid #334155',
                                                    backgroundColor: selectedTopic === 'all' ? '#3b82f6' : '#111827',
                                                    color: selectedTopic === 'all' ? '#fff' : '#cbd5e1',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                All Topics
                                            </button>
                                            {availableTags.map((tag) => {
                                                const label = formatTagLabel(tag);
                                                const isActive = selectedTopic === tag;
                                                return (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => setSelectedTopic(tag)}
                                                        style={{
                                                            padding: '10px 16px',
                                                            borderRadius: '999px',
                                                            border: isActive ? '1px solid #3b82f6' : '1px solid #334155',
                                                            backgroundColor: isActive ? '#3b82f6' : '#111827',
                                                            color: isActive ? '#fff' : '#cbd5e1',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {problemsLoading ? (
                                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#111827', borderRadius: '16px', border: '2px dashed #334155' }}>
                                    <p style={{ color: '#94a3b8' }}>Loading {selectedDifficulty === 'all' ? 'all levels' : selectedDifficulty} problems...</p>
                                </div>
                            ) : problemsError ? (
                                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#111827', borderRadius: '16px', border: '2px dashed #7f1d1d' }}>
                                    <p style={{ color: '#fecaca', marginBottom: '12px' }}>Error loading problems</p>
                                    <p style={{ color: '#cbd5e1', margin: 0 }}>{problemsError}</p>
                                </div>
                            ) : problems.length > 0 ? (
                                problems.map((prob, index) => (
                                    <div 
                                        key={prob._id} 
                                        className="problem-card"
                                        style={{ 
                                            backgroundColor: '#111827',
                                            border: '1px solid #1f2937', 
                                            padding: '24px', 
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            cursor: 'default'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>#{index + 1}</span>
                                                                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        {prob.title}
                                                                        {(() => {
                                                                            const solved = currentUser?.completedProblems?.some(cp => {
                                                                                try {
                                                                                    return (cp?._id?.toString() === prob._id) || (cp?.toString() === prob._id);
                                                                                } catch (e) { return false; }
                                                                            });
                                                                            return solved ? (
                                                                                <span style={{ color: '#16a34a', fontWeight: '800', marginLeft: '8px' }}>✔</span>
                                                                            ) : null;
                                                                        })()}
                                                                    </h3>
                                                                </div>
                                                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                                                    {prob.description.length > 150 ? prob.description.substring(0, 150) + '...' : prob.description}
                                                </p>
                                            </div>
                                            <span style={{ 
                                                padding: '6px 12px', 
                                                borderRadius: '8px', 
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                backgroundColor: prob.difficulty?.toLowerCase() === 'easy' ? '#1f2937' : prob.difficulty?.toLowerCase() === 'medium' ? '#312e81' : '#581c87',
                                                color: '#e2e8f0'
                                            }}>
                                                {prob.difficulty}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {prob.tags?.map(tag => (
                                                    <span key={tag} style={{ fontSize: '0.75rem', color: '#cbd5e1', backgroundColor: '#111827', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155' }}>{tag}</span>
                                                ))}
                                            </div>
                                            <Link 
                                                to={`/playground/${prob._id}`} 
                                                style={{ 
                                                    backgroundColor: '#3b82f6',
                                                    color: 'white',
                                                    padding: '10px 20px',
                                                    borderRadius: '10px',
                                                    textDecoration: 'none', 
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem',
                                                    transition: 'background-color 0.2s'
                                                }}
                                            >
                                                Try Challenge
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#111827', borderRadius: '16px', border: '2px dashed #334155' }}>
                                    <p style={{ color: '#94a3b8' }}>No problems found. Start by adding some in the database!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Leaderboard Section */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', color: '#e2e8f0', marginBottom: '20px' }}>Top Performers</h2>
                        <div style={{ 
                            backgroundColor: '#0f172a', 
                            borderRadius: '24px', 
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.25)',
                            border: '1px solid #1f2937',
                            overflow: 'hidden'
                        }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid #1f2937', backgroundColor: '#111827' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: '10px' }}>
                                    {/* 2nd Place */}
                                    {leaderboard[1] && (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '50px', height: '50px', backgroundColor: '#e2e8f0', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#475569' }}>2</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '600', width: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{leaderboard[1].username}</div>
                                        </div>
                                    )}
                                    {/* 1st Place */}
                                    {leaderboard[0] && (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '30px', marginBottom: '-5px' }}>👑</div>
                                            <div style={{ width: '70px', height: '70px', backgroundColor: '#fef08a', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #fde047', fontSize: '28px', fontWeight: '800', color: '#854d0e' }}>1</div>
                                            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#cbd5e1' }}>{leaderboard[0].username}</div>
                                        </div>
                                    )}
                                    {/* 3rd Place */}
                                    {leaderboard[2] && (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '45px', height: '45px', backgroundColor: '#ffedd5', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: '#9a3412' }}>3</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '600', width: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{leaderboard[2].username}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ padding: '0 10px' }}>
                                {leaderboard.map((user, index) => (
                                    <div key={user._id} style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '40px 1fr 60px', 
                                        alignItems: 'center', 
                                        padding: '16px 14px',
                                        backgroundColor: index === 0 ? '#111827' : 'transparent',
                                        borderBottom: index === leaderboard.length - 1 ? 'none' : '1px solid #1f2937'
                                    }}>
                                        <span style={{ fontWeight: '700', color: index < 3 ? '#3b82f6' : '#94a3b8' }}>{index + 1}</span>
                                        <div style={{ fontWeight: index < 3 ? '700' : '500', color: '#cbd5e1' }}>{user.username}</div>
                                        <div style={{ textAlign: 'right', fontWeight: '800', color: '#3b82f6' }}>{user.solvedCount}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #1f2937' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                                <strong style={{ color: '#fff' }}>Keep coding!</strong> Solve more problems to reach the top and earn your crown.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
