import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Key, 
  Calendar, 
  Clock, 
  LogOut, 
  ShieldCheck, 
  ShieldAlert, 
  Bot, 
  Star,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/firestore';
import './Profile.css';

export default function Profile() {
  const { user, logout, isFirebaseConfigured } = useAuth();
  const [firestoreProfile, setFirestoreProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function loadFirestoreData() {
      if (!user?.uid || !isFirebaseConfigured) return;
      setLoadingProfile(true);
      try {
        const docData = await getUserProfile(user.uid);
        if (isMounted) {
          setFirestoreProfile(docData);
        }
      } catch (err) {
        console.warn('Could not fetch firestore profile document:', err);
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    }

    loadFirestoreData();
    return () => {
      isMounted = false;
    };
  }, [user?.uid, isFirebaseConfigured]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Provider detection
  const providerId = user?.providerData?.[0]?.providerId || 'password';
  const providerName = providerId === 'google.com' ? 'Google OAuth' : 'Email & Password';

  const userInitials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || 'U';

  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Session Active';

  const lastLogin = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Current Session';

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <div className="profile-badge">
          <ShieldCheck size={14} />
          <span>Authenticated Account</span>
        </div>
        <h1 className="profile-title">
          User <span className="gradient-text">Profile</span>
        </h1>
        <p className="profile-subtitle">
          Manage your authenticated identity, security credentials, and Firestore-isolated profile data.
        </p>
      </div>

      <div className="profile-grid">
        {/* User Card */}
        <GlassCard className="user-overview-card">
          <div className="user-avatar-wrapper">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="user-avatar-img" />
            ) : (
              <div className="user-avatar-fallback font-mono">
                {userInitials}
              </div>
            )}
            <span className="user-online-dot"></span>
          </div>

          <h2 className="user-display-name">
            {firestoreProfile?.displayName || user?.displayName || 'Anonymous Developer'}
          </h2>
          <span className="user-email font-mono">{firestoreProfile?.email || user?.email || 'No email associated'}</span>

          <div className="user-provider-tag font-mono">
            <span>Provider:</span>
            <strong>{providerName}</strong>
          </div>

          <div className="logout-btn-container">
            <Button
              variant="outline"
              size="md"
              icon={LogOut}
              onClick={handleLogout}
              style={{ width: '100%', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fda4af' }}
            >
              Sign Out of Session
            </Button>
          </div>
        </GlassCard>

        {/* Details & Telemetry */}
        <div className="profile-details-col">
          <GlassCard className="details-card">
            <h3 className="details-card-title">Security & Identity Credentials</h3>
            
            <div className="metadata-rows font-mono">
              <div className="metadata-row">
                <span className="meta-label">
                  <Key size={14} className="meta-row-icon" />
                  <span>Unique ID (UID):</span>
                </span>
                <span className="meta-value uid-badge">{user?.uid || 'Not available'}</span>
              </div>

              <div className="metadata-row">
                <span className="meta-label">
                  <Mail size={14} className="meta-row-icon" />
                  <span>Email Verification:</span>
                </span>
                <span className="meta-value">
                  {user?.emailVerified ? (
                    <span className="verified-badge">Verified</span>
                  ) : (
                    <span className="unverified-badge">Active Session</span>
                  )}
                </span>
              </div>

              <div className="metadata-row">
                <span className="meta-label">
                  <Calendar size={14} className="meta-row-icon" />
                  <span>Account Created:</span>
                </span>
                <span className="meta-value">{createdAt}</span>
              </div>

              <div className="metadata-row">
                <span className="meta-label">
                  <Clock size={14} className="meta-row-icon" />
                  <span>Last Authentication:</span>
                </span>
                <span className="meta-value">{lastLogin}</span>
              </div>
            </div>
          </GlassCard>

          {/* Firestore Data Card */}
          <GlassCard className="details-card">
            <h3 className="details-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} style={{ color: 'var(--accent-violet)' }} />
              <span>Cloud Firestore Profile Metadata</span>
            </h3>

            <div className="metadata-rows font-mono">
              <div className="metadata-row">
                <span className="meta-label">
                  <span>Document Path:</span>
                </span>
                <span className="meta-value uid-badge" style={{ color: '#c4b5fd' }}>
                  users/{user?.uid || 'uid'}
                </span>
              </div>

              <div className="metadata-row">
                <span className="meta-label">
                  <span>Sync Status:</span>
                </span>
                <span className="meta-value">
                  {isFirebaseConfigured ? (
                    <span style={{ color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={13} />
                      <span>Document Partition Active</span>
                    </span>
                  ) : (
                    <span style={{ color: 'var(--accent-amber)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={13} />
                      <span>Awaiting Firebase Env Keys</span>
                    </span>
                  )}
                </span>
              </div>

              <div className="metadata-row">
                <span className="meta-label">
                  <span>Prediction Subcollection:</span>
                </span>
                <span className="meta-value uid-badge" style={{ color: '#67e8f9' }}>
                  users/{user?.uid || 'uid'}/predictions
                </span>
              </div>

              <div className="metadata-row">
                <span className="meta-label">
                  <span>Data Isolation:</span>
                </span>
                <span className="meta-value" style={{ color: 'var(--accent-emerald)' }}>
                  Enforced by UID Security Rules
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Quick Access Card */}
          <GlassCard className="quick-access-card">
            <h3 className="details-card-title">Production Inference Access</h3>
            <p className="quick-access-desc">
              Your account has full authenticated clearance to execute both production machine learning models:
            </p>
            <div className="quick-model-links">
              <Link to="/predict-agent" className="quick-model-pill">
                <Bot size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span>AI Coding Agent Classifier (XGBoost)</span>
              </Link>
              <Link to="/predict-stars" className="quick-model-pill">
                <Star size={16} style={{ color: 'var(--accent-amber)' }} />
                <span>Repository Popularity Forecaster (KNN)</span>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
