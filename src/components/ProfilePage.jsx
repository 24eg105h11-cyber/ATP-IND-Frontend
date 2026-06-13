import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../store/authStore';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileFormCard from './ProfileFormCard';
import ProfileSidebar from './ProfileSidebar';

const ProfilePage = () => {
    const { currentUser, updateProfile, loading, error: authError } = useAuth();
    const [formData, setFormData] = useState({
        username: currentUser?.username || '',
        email: currentUser?.email || ''
    });
    const [message, setMessage] = useState('');

    const solvedCount = currentUser?.completedProblems?.length || 0;
    const joinedLabel = useMemo(() => {
        if (!currentUser?.createdAt) return 'Recently joined';
        try {
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                year: 'numeric'
            }).format(new Date(currentUser.createdAt));
        } catch {
            return 'Recently joined';
        }
    }, [currentUser?.createdAt]);

    const completionRate = useMemo(() => {
        const totalSolved = solvedCount;
        if (totalSolved === 0) return 0;
        return Math.min(100, Math.round(35 + totalSolved * 7));
    }, [solvedCount]);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username,
                email: currentUser.email
            });
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await updateProfile(formData);
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 64px)',
            padding: '32px 20px 48px',
            background: 'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 32%), radial-gradient(circle at top right, rgba(16,185,129,0.16), transparent 28%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)'
        }}>
            <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
                <ProfileHeader currentUser={currentUser} joinedLabel={joinedLabel} solvedCount={solvedCount} />

                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px', alignItems: 'start' }}>
                    <section style={{ display: 'grid', gap: '20px' }}>
                        <ProfileStats solvedCount={solvedCount} completionRate={completionRate} role={currentUser?.role} />
                        <ProfileFormCard
                            currentUser={currentUser}
                            formData={formData}
                            setFormData={setFormData}
                            handleSubmit={handleSubmit}
                            loading={loading}
                            message={message}
                            authError={authError}
                        />
                    </section>

                    <ProfileSidebar
                        currentUser={currentUser}
                        formData={formData}
                        solvedCount={solvedCount}
                        chipStyle={chipStyle}
                    />
                </div>
            </div>
        </div>
    );
};

const chipStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '52px',
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(16,185,129,0.12))',
    color: '#0f172a',
    fontWeight: 800,
    border: '1px solid rgba(148,163,184,0.28)'
};

export default ProfilePage;
