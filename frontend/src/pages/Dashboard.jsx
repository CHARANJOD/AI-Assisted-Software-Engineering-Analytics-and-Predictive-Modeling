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
            <span>Overview & Analytics</span>
          </div>
          <h1 className="dashboard-title">
            Your Analytics <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="dashboard-lead">
            Track your predictions, explore quick tools, and review your recent software project insights.
          </p>
        </div>
        <BackendStatus />
      </div>

      {/* Quick Action Bar */}
      <div className="quick-actions-strip">
        <Link to="/predict-agent" className="quick-action-btn action-cyan">
          <Bot size={16} />
          <span>Identify AI Assistant</span>
        </Link>
        <Link to="/predict-stars" className="quick-action-btn action-amber">
          <Star size={16} />
          <span>Estimate Popularity</span>
        </Link>
        <Link to="/history" className="quick-action-btn action-purple">
          <HistoryIcon size={16} />
          <span>View Prediction History</span>
        </Link>
      </div>

      {/* Prediction Stats Grid */}
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
            <span className="stat-label">AI Assistant Predictions</span>
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
            <span className="stat-label">Popularity Estimates</span>
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
            <span>Recent Predictions</span>
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
              No prediction records found for your account. Run a prediction to see your results recorded here.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/predict-agent">
                <Button variant="primary" size="sm" icon={Bot}>
                  Identify AI Assistant
                </Button>
              </Link>
              <Link to="/predict-stars">
                <Button variant="secondary" size="sm" icon={Star} style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}>
                  Estimate Popularity
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
                      <span>{isAgent ? 'AI Assistant' : 'Popularity'}</span>
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

      {/* Feature Tool Launchers Grid */}
      <div className="launchers-grid">
        {/* Tool 1 Launcher Card */}
        <GlassCard hoverEffect glow className="launcher-card">
          <div className="launcher-header">
            <div className="launcher-icon agent-bg">
              <Bot size={26} />
            </div>
            <span className="launcher-status-badge">Ready</span>
          </div>

          <h3 className="launcher-title">Identify AI Assistant</h3>
          <p className="launcher-desc">
            Find out which AI coding assistant was most likely used for a pull request by providing basic pull request details.
          </p>

          <div className="launcher-specs font-mono">
            <div className="spec-item">
              <span className="spec-k">Confidence</span>
              <span className="spec-v text-emerald">99.4% Accuracy</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Supported</span>
              <span className="spec-v">6 Major Assistants</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Inputs</span>
              <span className="spec-v">PR Title & Details</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Speed</span>
              <span className="spec-v text-cyan">Real-time (&lt;1s)</span>
            </div>
          </div>

          <Link to="/predict-agent">
            <Button variant="primary" size="md" icon={ArrowRight} style={{ width: '100%' }}>
              Identify AI Assistant
            </Button>
          </Link>
        </GlassCard>

        {/* Tool 2 Launcher Card */}
        <GlassCard hoverEffect glow className="launcher-card">
          <div className="launcher-header">
            <div className="launcher-icon stars-bg">
              <Star size={26} />
            </div>
            <span className="launcher-status-badge">Ready</span>
          </div>

          <h3 className="launcher-title">Estimate Repository Popularity</h3>
          <p className="launcher-desc">
            Get an estimate of how popular a GitHub repository may become based on its language, license, and forks.
          </p>

          <div className="launcher-specs font-mono">
            <div className="spec-item">
              <span className="spec-k">Benchmark</span>
              <span className="spec-v text-cyan">260K+ Repositories</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Result</span>
              <span className="spec-v">Estimated Star Count</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Inputs</span>
              <span className="spec-v">Language, License & Forks</span>
            </div>
            <div className="spec-item">
              <span className="spec-k">Speed</span>
              <span className="spec-v text-amber">Instant Analysis</span>
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
              Estimate Popularity
            </Button>
          </Link>
        </GlassCard>
      </div>

      {/* Helpful Tips & Platform Highlights */}
      <GlassCard className="telemetry-panel">
        <h3 className="telemetry-title">
          <Sparkles size={18} className="telemetry-icon" />
          <span>Tips for Best Prediction Results</span>
        </h3>

        <div className="telemetry-grid font-mono">
          <div className="telemetry-box">
            <span className="telemetry-label">Pull Request Titles</span>
            <span className="telemetry-value">Use descriptive titles including scope or feature</span>
          </div>

          <div className="telemetry-box">
            <span className="telemetry-label">Repository Context</span>
            <span className="telemetry-value">Provide genuine repository owner and project names</span>
          </div>

          <div className="telemetry-box">
            <span className="telemetry-label">Account Privacy</span>
            <span className="telemetry-value">Your predictions are kept private to your account</span>
          </div>

          <div className="telemetry-box">
            <span className="telemetry-label">Instant Analysis</span>
            <span className="telemetry-value">Results are generated live with full summary details</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
