import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, Mail, AlertCircle, Sparkles, ShieldAlert } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { login, loginWithGoogle, isFirebaseConfigured, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login (or default to /dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    if (!email.trim()) {
      setLocalError('Email address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setLocalError('Password is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="auth-page-container container">
      <GlassCard className="auth-card">
        {/* Card Header */}
        <div className="auth-header">
          <div className="auth-icon-circle">
            <Lock size={24} />
          </div>
          <h2 className="auth-title">
            Sign <span className="gradient-text">In</span>
          </h2>
          <p className="auth-subtitle">
            Sign in to access your predictions and history
          </p>
        </div>

        {/* Configuration Notice if Firebase is unconfigured */}
        {!isFirebaseConfigured && (
          <div className="firebase-notice-banner">
            <ShieldAlert size={18} className="notice-icon" />
            <div className="notice-text">
              <strong>Authentication Setup Notice</strong>
              <span>
                To enable live accounts, service credentials need to be configured in <code>frontend/.env</code>.
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {displayError && (
          <div className="auth-error-alert">
            <AlertCircle size={18} className="alert-icon" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="signin-email" className="auth-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                type="email"
                id="signin-email"
                required
                disabled={submitting || googleSubmitting}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError(null);
                }}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="signin-password" className="auth-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type="password"
                id="signin-password"
                required
                disabled={submitting || googleSubmitting}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalError(null);
                }}
                className="auth-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={LogIn}
            loading={submitting}
            disabled={submitting || googleSubmitting || !isFirebaseConfigured}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {submitting ? 'Signing In...' : 'Sign In with Email'}
          </Button>
        </form>

        {/* OAuth Divider */}
        <div className="oauth-divider">
          <span className="divider-line"></span>
          <span className="divider-text font-mono">OR</span>
          <span className="divider-line"></span>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting || googleSubmitting || !isFirebaseConfigured}
          className="google-signin-btn"
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleSubmitting ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        {/* Footer Link */}
        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/signup" className="auth-switch-link">
            Create Account
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
