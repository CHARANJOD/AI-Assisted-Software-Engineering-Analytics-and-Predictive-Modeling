import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Star, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Zap, 
  Server, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Clock,
  History as HistoryIcon,
  BarChart3,
  Flame,
  AlertCircle
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import BackendStatus from '../components/common/BackendStatus';
import { useAuth } from '../context/AuthContext';
import { getUserPredictionStats } from '../services/firestore';
import './Dashboard.css';

export default function Dashboard() {
  const { user, isFirebaseConfigured } = useAuth();
  const [stats, setStats] = useState({
    totalPredictions: 0,
    agentPredictions: 0,
    starsPredictions: 0,
    recentPredictions: [],
    latestActivity: null
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      if (!user?.uid) {
        if (isMounted) setLoadingStats(false);
        return;
      }

      setLoadingStats(true);
      try {
        const data = await getUserPredictionStats(user.uid);
        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard prediction stats:', err);
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const formatActivityTime = (date) => {
    if (!date) return 'No activity recorded';
    try {
      const d = date instanceof Date ? date : new Date(date);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="dashboard-page container">
      {/* Top Header */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-pre-title">
            <Activity size={16} />
            <span>Operational ML Workspace</span>
          </div>
          <h1 className="dashboard-title">
            Analytics & Inference <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="dashboard-lead">
            Centralized telemetry control room monitoring deployed XGBoost multiclass and KNN regression endpoints.
          </p>
        </div>
        <BackendStatus />
      </div>

      {/* Quick Action Bar */}
      <div className="quick-actions-strip">
        <Link to="/predict-agent" className="quick-action-btn action-cyan">
          <Bot size={16} />
          <span>Launch Agent Classifier</span>
        </Link>
        <Link to="/predict-stars" className="quick-action-btn action-amber">
          <Star size={16} />
          <span>Launch Popularity Forecaster</span>
        </Link>
        <Link to="/history" className="quick-action-btn action-purple">
          <HistoryIcon size={16} />
          <span>View Telemetry Audit Stream</span>
        </Link>
      </div>

      {/* Factual Prediction Stats Grid */}
      <div className="stats-grid font-mono">
        <GlassCard className="stat-card">
          <div className="stat-icon-wrap stat-icon-total">
            <BarChart3 size={24} />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Total Predictions</span>
            <span className="stat-number">
              {loadingStats ? '...' : stats.totalPredictions}
            </span>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon-wrap stat-icon-agent">
            <Bot size={24} />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Agent Inferences</span>
            <span className="stat-number">
              {loadingStats ? '...' : stats.agentPredictions}
            </span>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon-wrap stat-icon-stars">
            <Star size={24} />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Stars Forecasts</span>
            <span className="stat-number">
              {loadingStats ? '...' : stats.starsPredictions}
            </span>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon-wrap stat-icon-activity">
            <Clock size={24} />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Latest Activity</span>
            <span className="stat-activity-text">
              {loadingStats ? '...' : formatActivityTime(stats.latestActivity)}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Recent Predictions Section */}
      <div className="recent-activity-section">
        <div className="section-header-row">
          <h3 className="section-title">
            <HistoryIcon size={18} style={{ color: 'var(--accent-violet)' }} />
            <span>Recent Prediction Telemetry</span>
          </h3>
          {stats.recentPredictions.length > 0 && (
            <Link to="/history" className="view-all-link">
              <span>View Full History</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {stats.recentPredictions.length === 0 ? (
          <GlassCard style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1rem' }}>
              No prediction records found for your account. Run a prediction to begin recording telemetry.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/predict-agent">
                <Button variant="primary" size="sm" icon={Bot}>
                  Test Agent Model
                </Button>
              </Link>
              <Link to="/predict-stars">
                <Button variant="secondary" size="sm" icon={Star} style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}>
                  Test Stars Model
                </Button>
              </Link>
            </div>
          </GlassCard>
        ) : (
          <div className="recent-predictions-list">
            {stats.recentPredictions.map((rec) => {
              const isAgent = (rec.modelType || rec.model) === 'agent';
              return (
                <GlassCard key={rec.id} className="recent-prediction-row">
                  <div className="recent-meta-col">
                    <span className={`history-model-badge ${isAgent ? 'badge-agent' : 'badge-stars'}`}>
                      {isAgent ? <Bot size={13} /> : <Star size={13} />}
                      <span>{isAgent ? 'Agent' : 'Stars'}</span>
                    </span>
                    <span className="recent-time font-mono">
                      {formatActivityTime(rec.createdAtDate)}
                    </span>
                  </div>

                  <div className="recent-details-col font-mono">
                    {isAgent
                      ? rec.input?.title
                        ? `PR: "${rec.input.title.slice(0, 35)}${rec.input.title.length > 35 ? '...' : ''}"`
                        : 'Pull Request'
                      : `Repo: ${rec.input?.repository_owner}/${rec.input?.repository_name}`}
                  </div>

                  <div className="recent-result-col font-mono">
                    {isAgent ? (
                      <span style={{ color: '#38bdf8' }}>{rec.output?.predicted_agent}</span>
                    ) : (
                      <span style={{ color: '#fbbf24' }}>
                        {typeof rec.output?.predicted_stars === 'number'
                          ? `${Math.round(rec.output.predicted_stars).toLocaleString()} stars`
                          : rec.output?.predicted_stars}
                      </span>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Model Launchers Grid */}
      <div className="launchers-grid">
        {/* Model 1 Launcher Card */}
        <GlassCard hoverEffect glow className="launcher-card">
          <div className="launcher-header">
            <div className="launcher-icon agent-bg">
              <Bot size={26} />
            </div>
            <span className="launcher-status-badge">FastAPI Active</span>
          </div>

          <h3 className="launcher-title">AI Coding Agent Classifier</h3>
          <p className="launcher-desc">
            Classify pull request contributions across 6 coding agents: Claude Code, Copilot, Cursor, Devin, Google Jules, and Codex.
          </p>

          <div className="launcher-specs font-mono">
            <div className="spec-item">
              <span className="spec-k">Algorithm</span>
              <span className="spec-v">XGBoost (multi:softmax)</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Benchmark F1</span>
              <span className="spec-v text-emerald">99.43% Macro F1</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Feature Space</span>
              <span className="spec-v">5,330 Sparse Features</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Endpoint</span>
              <span className="spec-v text-cyan">POST /predict/agent</span>
            </div>
          </div>

          <Link to="/predict-agent">
            <Button variant="primary" size="md" icon={ArrowRight} style={{ width: '100%' }}>
              Launch Model 1 Interface
            </Button>
          </Link>
        </GlassCard>

        {/* Model 2 Launcher Card */}
        <GlassCard hoverEffect glow className="launcher-card">
          <div className="launcher-header">
            <div className="launcher-icon stars-bg">
              <Star size={26} />
            </div>
            <span className="launcher-status-badge">FastAPI Active</span>
          </div>

          <h3 className="launcher-title">Repository Popularity Regressor</h3>
          <p className="launcher-desc">
            Evaluate high-dimensional repository telemetry, license standing, and fork frequency to estimate community star volume.
          </p>

          <div className="launcher-specs font-mono">
            <div className="spec-item">
              <span className="spec-k">Algorithm</span>
              <span className="spec-v">KNN Regressor (k=5)</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Training Basis</span>
              <span className="spec-v text-cyan">261,438 Repositories</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Feature Space</span>
              <span className="spec-v">416,751 Sparse Dimensions</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Endpoint</span>
              <span className="spec-v text-amber">POST /predict/stars</span>
            </div>
          </div>

          <Link to="/predict-stars">
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#1a1300'
              }}
            >
              Launch Model 2 Interface
            </Button>
          </Link>
        </GlassCard>
      </div>

      {/* Production Telemetry Overview */}
      <GlassCard className="telemetry-panel">
        <h3 className="telemetry-title">
          <Server size={18} className="telemetry-icon" />
          <span>Architecture & Cloud Runtime Telemetry</span>
        </h3>

        <div className="telemetry-grid font-mono">
          <div className="telemetry-box">
            <span className="telemetry-label">Backend Provider</span>
            <span className="telemetry-value">Render Cloud (Linux Runtime)</span>
          </div>

          <div className="telemetry-box">
            <span className="telemetry-label">API Gateway</span>
            <span className="telemetry-value">FastAPI 0.141.1 + Uvicorn</span>
          </div>

          <div className="telemetry-box">
            <span className="telemetry-label">Data Validation</span>
            <span className="telemetry-value">Pydantic v2 (Strict Schema)</span>
          </div>

          <div className="telemetry-box">
            <span className="telemetry-label">Model Serialization</span>
            <span className="telemetry-value">Joblib (11 Preloaded Artifacts)</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
