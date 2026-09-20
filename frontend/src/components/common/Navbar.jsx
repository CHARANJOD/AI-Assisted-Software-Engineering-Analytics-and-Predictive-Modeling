import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Cpu, 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Bot, 
  Star, 
  History as HistoryIcon 
} from 'lucide-react';
import BackendStatus from './BackendStatus';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSignOut = async () => {
    closeMobileMenu();
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItemClass = ({ isActive }) =>
    `nav-link ${isActive ? 'nav-link-active' : ''}`;

  const userInitials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon-wrapper">
            <Cpu size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">AI-SE <span className="gradient-text">Analytics</span></span>
            <span className="brand-tag">ML Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <NavLink to="/" className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={navItemClass}>
            Dashboard
          </NavLink>
          <NavLink to="/predict-agent" className={navItemClass}>
            Agent Predictor
          </NavLink>
          <NavLink to="/predict-stars" className={navItemClass}>
            Stars Predictor
          </NavLink>
          <NavLink to="/history" className={navItemClass}>
            History
          </NavLink>
          <NavLink to="/about" className={navItemClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navItemClass}>
            Contact
          </NavLink>
        </nav>

        {/* Desktop Right Side Actions */}
        <div className="navbar-actions desktop-actions">
          <BackendStatus />

          {user ? (
            <div className="nav-user-profile-menu">
              <Link to="/profile" className="nav-profile-pill" title="View Profile">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="nav-user-avatar" />
                ) : (
                  <span className="nav-avatar-fallback font-mono">{userInitials}</span>
                )}
                <span className="nav-user-name">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                icon={LogOut}
                onClick={handleSignOut}
                title="Sign Out"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="outline" size="sm" icon={LogIn}>
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm" icon={UserPlus}>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-status-wrapper">
            <BackendStatus />
          </div>

          {user && (
            <div className="mobile-user-greeting">
              <span className="greeting-label font-mono">Signed in as:</span>
              <span className="greeting-name">{user.displayName || user.email}</span>
            </div>
          )}

          <nav className="mobile-nav">
            <NavLink to="/" className={navItemClass} onClick={closeMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navItemClass} onClick={closeMobileMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/predict-agent" className={navItemClass} onClick={closeMobileMenu}>
              Agent Predictor
            </NavLink>
            <NavLink to="/predict-stars" className={navItemClass} onClick={closeMobileMenu}>
              Stars Predictor
            </NavLink>
            <NavLink to="/history" className={navItemClass} onClick={closeMobileMenu}>
              History
            </NavLink>
            <NavLink to="/about" className={navItemClass} onClick={closeMobileMenu}>
              About
            </NavLink>
            <NavLink to="/contact" className={navItemClass} onClick={closeMobileMenu}>
              Contact
            </NavLink>
            {user && (
              <NavLink to="/profile" className={navItemClass} onClick={closeMobileMenu}>
                Profile Settings
              </NavLink>
            )}
          </nav>

          <div className="mobile-auth-actions">
            {user ? (
              <Button
                variant="outline"
                size="md"
                icon={LogOut}
                onClick={handleSignOut}
                style={{ width: '100%', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fda4af' }}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Link to="/signin" onClick={closeMobileMenu}>
                  <Button variant="outline" size="md" icon={LogIn} style={{ width: '100%' }}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={closeMobileMenu}>
                  <Button variant="primary" size="md" icon={UserPlus} style={{ width: '100%' }}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
