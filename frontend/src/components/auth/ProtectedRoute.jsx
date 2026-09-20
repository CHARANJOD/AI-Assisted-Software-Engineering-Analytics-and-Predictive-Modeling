import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../common/GlassCard';
import './ProtectedRoute.css';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-container">
        <GlassCard className="auth-loading-card">
          <Loader2 size={36} className="auth-loading-spinner" />
          <h3 className="auth-loading-title">Verifying Session...</h3>
          <p className="auth-loading-sub">Connecting to Firebase authentication services.</p>
        </GlassCard>
      </div>
    );
  }

  if (!user) {
    // Redirect to sign in while preserving the intended destination
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
