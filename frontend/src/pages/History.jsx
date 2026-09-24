import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Bot, 
  Star, 
  Clock, 
  Trash2, 
  Eye, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Code2,
  GitBranch,
  X,
  FileText,
  CheckCircle2,
  Filter
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import BackendStatus from '../components/common/BackendStatus';
import { useAuth } from '../context/AuthContext';
import { getUserPredictions, deletePrediction } from '../services/firestore';
import './History.css';

export default function History() {
  const { user, isFirebaseConfigured } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'agent' | 'stars'
  const [inspectingItem, setInspectingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchHistory = useCallback(async (isRefresh = false) => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const records = await getUserPredictions(user.uid);
      setPredictions(records);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Unable to retrieve prediction history from Cloud Firestore.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (predictionId) => {
    if (!user?.uid || !predictionId) return;

    setDeletingId(predictionId);
    try {
      await deletePrediction(user.uid, predictionId);
      setPredictions((prev) => prev.filter((p) => p.id !== predictionId));
      setDeleteConfirmId(null);
      if (inspectingItem?.id === predictionId) {
        setInspectingItem(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete prediction record. Please check your connection.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered predictions
  const filteredPredictions = predictions.filter((p) => {
    const type = p.modelType || p.model;
    if (activeFilter === 'agent') return type === 'agent';
    if (activeFilter === 'stars') return type === 'stars';
    return true;
  });

  const agentCount = predictions.filter((p) => (p.modelType || p.model) === 'agent').length;
  const starsCount = predictions.filter((p) => (p.modelType || p.model) === 'stars').length;

  const formatDate = (date) => {
    if (!date) return 'Unknown timestamp';
    try {
      const d = date instanceof Date ? date : new Date(date);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown timestamp';
    }
  };

  return (
    <div className="history-page container">
      {/* Header */}
      <div className="history-header">
        <div>
          <div className="history-pre-title">
            <HistoryIcon size={16} />
            <span>Saved Predictions • Private to You</span>
          </div>
          <h1 className="history-title">
            Prediction <span className="gradient-text">History</span>
          </h1>
          <p className="history-subtitle">
            A complete record of your past predictions, saved securely to your account.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => fetchHistory(true)}
            disabled={loading || refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh History'}
          </Button>
          <BackendStatus />
        </div>
      </div>

      {/* Unconfigured Alert */}
      {!isFirebaseConfigured && (
        <GlassCard style={{ marginBottom: '2rem', borderColor: 'rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.05)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <AlertCircle size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fbbf24', marginBottom: '0.25rem' }}>
                Cloud Storage Notice
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Cloud storage requires configured service credentials in <code>frontend/.env</code> to persist live predictions across sessions. During local testing with mock credentials, prediction history is stored during your active session.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Toolbar / Filters */}
      <div className="history-toolbar">
        <div className="history-filter-chips">
          <button
            className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <Filter size={13} />
            <span>All Predictions</span>
            <span className="filter-count font-mono">{predictions.length}</span>
          </button>

          <button
            className={`filter-chip ${activeFilter === 'agent' ? 'active' : ''}`}
            onClick={() => setActiveFilter('agent')}
          >
            <Bot size={13} style={{ color: 'var(--accent-cyan)' }} />
            <span>AI Assistant</span>
            <span className="filter-count font-mono">{agentCount}</span>
          </button>

          <button
            className={`filter-chip ${activeFilter === 'stars' ? 'active' : ''}`}
            onClick={() => setActiveFilter('stars')}
          >
            <Star size={13} style={{ color: 'var(--accent-amber)' }} />
            <span>Repository Popularity</span>
            <span className="filter-count font-mono">{starsCount}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <GlassCard className="history-loading-card">
          <div className="history-spinner"></div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Loading Prediction Records...
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Fetching your saved prediction history...
          </p>
        </GlassCard>
      )}

      {/* Error State */}
      {!loading && error && (
        <GlassCard className="history-error-card">
          <div className="empty-icon-wrap" style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
            <AlertCircle size={32} />
          </div>
          <h3 className="empty-title">Failed to Load Records</h3>
          <p className="empty-desc">{error}</p>
          <Button variant="primary" size="md" onClick={() => fetchHistory(false)}>
            Try Again
          </Button>
        </GlassCard>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPredictions.length === 0 && (
        <GlassCard className="history-empty-card">
          <div className="empty-icon-wrap">
            <HistoryIcon size={32} />
          </div>
          <h3 className="empty-title">No predictions yet</h3>
          <p className="empty-desc">
            Make your first prediction to see it recorded here.
          </p>
          <div className="empty-actions">
            <Link to="/predict-agent">
              <Button variant="primary" size="md" icon={Bot}>
                Identify AI Assistant
              </Button>
            </Link>
            <Link to="/predict-stars">
              <Button
                variant="secondary"
                size="md"
                icon={Star}
                style={{ borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24' }}
              >
                Estimate Popularity
              </Button>
            </Link>
          </div>
        </GlassCard>
      )}

      {/* Predictions List */}
      {!loading && !error && filteredPredictions.length > 0 && (
        <div className="history-list">
          {filteredPredictions.map((record) => {
            const isAgent = (record.modelType || record.model) === 'agent';
            const isStars = (record.modelType || record.model) === 'stars';
            const isConfirming = deleteConfirmId === record.id;
            const isDeleting = deletingId === record.id;

            return (
              <GlassCard key={record.id} className="history-item-card">
                {/* Header */}
                <div className="history-item-header">
                  <div className="history-item-meta">
                    <span className={`history-model-badge ${isAgent ? 'badge-agent' : 'badge-stars'}`}>
                      {isAgent ? <Bot size={14} /> : <Star size={14} />}
                      <span>{isAgent ? 'AI Assistant' : 'Repository Popularity'}</span>
                    </span>

                    <span className="history-time-stamp font-mono">
                      <Clock size={13} />
                      <span>{formatDate(record.createdAtDate)}</span>
                    </span>
                  </div>

                  <div className="history-item-actions">
                    <button
                      className="action-icon-btn"
                      title="View prediction details"
                      onClick={() => setInspectingItem(record)}
                    >
                      <Eye size={15} />
                    </button>

                    {isConfirming ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                          disabled={isDeleting}
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          {isDeleting ? 'Deleting...' : 'Confirm'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <button
                        className="action-icon-btn delete-btn"
                        title="Delete this record"
                        onClick={() => setDeleteConfirmId(record.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="history-item-body">
                  {/* Left: Input Summary */}
                  <div>
                    {isAgent ? (
                      <div>
                        <div className="input-summary-title">
                          {record.input?.title ? `"${record.input.title}"` : 'Pull Request Submission'}
                        </div>
                        <div className="input-summary-tags font-mono">
                          <span className="summary-pill">
                            <Code2 size={12} />
                            <span>{record.input?.language || 'Unknown'}</span>
                          </span>
                          <span className="summary-pill">
                            <GitBranch size={12} />
                            <span>{record.input?.forks ?? 0} forks</span>
                          </span>
                          <span className="summary-pill">
                            <Star size={12} style={{ color: '#fbbf24' }} />
                            <span>{record.input?.stars ?? 0} stars</span>
                          </span>
                          <span className="summary-pill">
                            <span>{record.input?.followers ?? 0} followers</span>
                          </span>
                          <span className="summary-pill">
                            <span>{record.input?.is_forked ? 'Fork' : 'Original'}</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="input-summary-title font-mono">
                          {record.input?.repository_owner}/{record.input?.repository_name}
                        </div>
                        <div className="input-summary-tags font-mono">
                          <span className="summary-pill">
                            <Code2 size={12} />
                            <span>{record.input?.language || 'Unknown'}</span>
                          </span>
                          <span className="summary-pill">
                            <span>License: {record.input?.license || 'None'}</span>
                          </span>
                          <span className="summary-pill">
                            <GitBranch size={12} />
                            <span>{record.input?.forks ?? 0} forks</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Actual Output */}
                  <div className="prediction-result-display">
                    <span className="result-label">Prediction Result</span>
                    {isAgent ? (
                      <div className="result-val-agent">
                        <Bot size={16} />
                        <span>{record.output?.predicted_agent || 'Unknown'}</span>
                      </div>
                    ) : (
                      <div className="result-val-stars font-mono">
                        {typeof record.output?.predicted_stars === 'number'
                          ? Math.round(record.output.predicted_stars).toLocaleString()
                          : record.output?.predicted_stars || '0'}
                        <span>stars</span>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Inspect Payload Modal */}
      {inspectingItem && (
        <div className="modal-overlay" onClick={() => setInspectingItem(null)}>
          <GlassCard className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <FileText size={18} style={{ color: 'var(--accent-violet)' }} />
                <span>Prediction Details</span>
              </div>
              <button className="modal-close-btn" onClick={() => setInspectingItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body font-mono">
              <div>
                <div className="modal-section-title">Prediction Summary</div>
                <pre className="payload-pre">
{JSON.stringify({
  predictionType: inspectingItem.modelType || inspectingItem.model,
  date: inspectingItem.createdAtDate?.toISOString() || 'N/A'
}, null, 2)}
                </pre>
              </div>

              <div>
                <div className="modal-section-title">Submitted Information</div>
                <pre className="payload-pre">
{JSON.stringify(inspectingItem.input || {}, null, 2)}
                </pre>
              </div>

              <div>
                <div className="modal-section-title">Prediction Output</div>
                <pre className="payload-pre">
{JSON.stringify(inspectingItem.output || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setInspectingItem(null)}>
                Close
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
