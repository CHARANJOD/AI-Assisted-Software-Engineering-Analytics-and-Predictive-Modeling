import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import AgentPrediction from './pages/AgentPrediction';
import StarsPrediction from './pages/StarsPrediction';
import History from './pages/History';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <AuthProvider>
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/predict/agent"
              element={
                <ProtectedRoute>
                  <AgentPrediction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/predict-agent"
              element={
                <ProtectedRoute>
                  <AgentPrediction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/predict/stars"
              element={
                <ProtectedRoute>
                  <StarsPrediction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/predict-stars"
              element={
                <ProtectedRoute>
                  <StarsPrediction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
