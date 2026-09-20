import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Code2, 
  GitFork, 
  Users, 
  Calendar, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  Database
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import BackendStatus from '../components/common/BackendStatus';
import { predictAgent } from '../services/apiService';
import { POPULAR_LANGUAGES, ALL_LANGUAGES } from '../data/languages';
import { AGENT_PRESETS } from '../data/samplePresets';
import { AGENT_PROFILES } from '../data/agents';
import { useAuth } from '../context/AuthContext';
import { savePrediction } from '../services/firestore';
import './AgentPrediction.css';

export default function AgentPrediction() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    language: 'Python',
    forks: 0,
    stars: 0,
    is_forked: false,
    followers: 0,
    following: 0,
    created_at: new Date().toISOString().slice(0, 16),
    user_created_at: '2023-01-01T00:00'
  });

  const [loading, setLoading] = useState(false);
  const [coldStartNotice, setColdStartNotice] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showRawPayload, setShowRawPayload] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [savedToHistory, setSavedToHistory] = useState(false);

  // Cold start timer effect
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setColdStartNotice(true);
      }, 5000);
    } else {
      setColdStartNotice(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const handlePresetSelect = (preset) => {
    setActivePreset(preset.id);
    setFormData({
      ...preset.data,
      created_at: preset.data.created_at.slice(0, 16),
      user_created_at: preset.data.user_created_at.slice(0, 16)
    });
    setSavedToHistory(false);
    setError(null);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      body: '',
      language: 'Python',
      forks: 0,
      stars: 0,
      is_forked: false,
      followers: 0,
      following: 0,
      created_at: new Date().toISOString().slice(0, 16),
      user_created_at: '2023-01-01T00:00'
    });
    setActivePreset(null);
    setResult(null);
    setSavedToHistory(false);
    setError(null);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError({ title: 'Validation Error', message: 'Pull Request title is required.' });
      return false;
    }
    if (!formData.body.trim()) {
      setError({ title: 'Validation Error', message: 'Pull Request body description is required.' });
      return false;
    }
    if (!formData.language) {
      setError({ title: 'Validation Error', message: 'Please select a programming language.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSavedToHistory(false);

    try {
      const response = await predictAgent(formData);
      setResult(response);

      // Save to Firestore for authenticated user
      if (user?.uid) {
        try {
          await savePrediction(user.uid, {
            modelType: 'agent',
            input: response.payload,
            output: { predicted_agent: response.predicted_agent }
          });
          setSavedToHistory(true);
        } catch (saveErr) {
          console.warn('Failed to record prediction in Firestore:', saveErr);
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const predictedProfile = result ? AGENT_PROFILES[result.predicted_agent] : null;

  return (
    <div className="agent-prediction-page container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-pre-title">
            <Bot size={16} />
            <span>Model 1 Inference • XGBoost 99.4% F1</span>
          </div>
          <h1 className="page-main-title">
            AI Coding Agent <span className="gradient-text">Identification</span>
          </h1>
          <p className="page-lead-desc">
            Analyze pull request text semantics, repository popularity, and author timestamps to determine
            which frontier AI assistant authored or assisted with the contribution.
          </p>
        </div>
        <BackendStatus />
      </div>

      {/* Preset Action Bar */}
      <div className="preset-bar">
        <span className="preset-bar-label">
          <Sparkles size={15} />
          <span>Test with Presets:</span>
        </span>
        <div className="preset-chips">
          {AGENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preset-chip ${activePreset === preset.id ? 'preset-chip-active' : ''}`}
              onClick={() => handlePresetSelect(preset)}
            >
              <span className="preset-chip-name">{preset.name}</span>
            </button>
          ))}
          {activePreset && (
            <button type="button" className="preset-reset-btn" onClick={handleReset} title="Reset Form">
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Cold Start Notice Banner */}
      {coldStartNotice && (
        <div className="cold-start-banner pulse">
          <Clock size={18} className="cold-start-icon" />
          <div className="cold-start-text">
            <strong>Waking up serverless ML instance on Render...</strong>
            <span>Free-tier compute instances spin down after inactivity. The initial inference may take up to 60-90 seconds. Please wait.</span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          <AlertCircle size={20} className="error-icon" />
          <div className="error-content">
            <h4>{error.title || 'Inference Error'}</h4>
            <p>{error.message}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Form (Left) & Result (Right) */}
      <div className="prediction-layout-grid">
        {/* Input Form Column */}
        <div className="form-column">
          <GlassCard className="prediction-form-card">
            <form onSubmit={handleSubmit} className="agent-form">
              {/* Section 1: Pull Request Semantics */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <Code2 size={18} />
                  <span>Pull Request Text Content</span>
                </h3>

                <div className="input-field-group">
                  <div className="label-row">
                    <label htmlFor="title" className="input-label">Pull Request Title *</label>
                    <span className="char-count font-mono">{formData.title.length} chars</span>
                  </div>
                  <input
                    type="text"
                    id="title"
                    required
                    placeholder="e.g. feat(api): implement JWT token authentication and user verification"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-input"
                  />
                </div>

                <div className="input-field-group">
                  <div className="label-row">
                    <label htmlFor="body" className="input-label">Pull Request Description / Body *</label>
                    <span className="char-count font-mono">{formData.body.length} chars</span>
                  </div>
                  <textarea
                    id="body"
                    required
                    rows={6}
                    placeholder="e.g. Added JWT token generator, updated auth middleware, created unit test suite covering token expiration..."
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className="text-input text-area"
                  />
                </div>
              </div>

              {/* Section 2: Repository Attributes */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <GitFork size={18} />
                  <span>Repository Context</span>
                </h3>

                <div className="input-row-2col">
                  <div className="input-field-group">
                    <label htmlFor="language" className="input-label">Primary Language *</label>
                    <select
                      id="language"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="text-input select-input"
                    >
                      <optgroup label="Popular Languages">
                        {POPULAR_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </optgroup>
                      <optgroup label="All Supported Model Languages (316)">
                        {ALL_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="input-field-group toggle-group">
                    <label className="input-label">Is Forked Repository?</label>
                    <div className="toggle-switch-wrapper">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={formData.is_forked}
                          onChange={(e) => setFormData({ ...formData, is_forked: e.target.checked })}
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="toggle-state-text font-mono">
                        {formData.is_forked ? 'true (Fork)' : 'false (Root)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="input-row-2col">
                  <div className="input-field-group">
                    <label htmlFor="forks" className="input-label">Repository Forks *</label>
                    <input
                      type="number"
                      id="forks"
                      min={0}
                      step={1}
                      required
                      value={formData.forks}
                      onChange={(e) => setFormData({ ...formData, forks: e.target.value })}
                      className="text-input"
                    />
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="stars" className="input-label">Repository Stars *</label>
                    <input
                      type="number"
                      id="stars"
                      min={0}
                      step={1}
                      required
                      value={formData.stars}
                      onChange={(e) => setFormData({ ...formData, stars: e.target.value })}
                      className="text-input"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: User & Timestamps */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <Users size={18} />
                  <span>Developer & Temporal Telemetry</span>
                </h3>

                <div className="input-row-2col">
                  <div className="input-field-group">
                    <label htmlFor="followers" className="input-label">Author Followers *</label>
                    <input
                      type="number"
                      id="followers"
                      min={0}
                      step={1}
                      required
                      value={formData.followers}
                      onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                      className="text-input"
                    />
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="following" className="input-label">Author Following *</label>
                    <input
                      type="number"
                      id="following"
                      min={0}
                      step={1}
                      required
                      value={formData.following}
                      onChange={(e) => setFormData({ ...formData, following: e.target.value })}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="input-row-2col">
                  <div className="input-field-group">
                    <label htmlFor="created_at" className="input-label">PR Created Date-Time *</label>
                    <input
                      type="datetime-local"
                      id="created_at"
                      required
                      value={formData.created_at}
                      onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
                      className="text-input font-mono"
                    />
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="user_created_at" className="input-label">User Account Created *</label>
                    <input
                      type="datetime-local"
                      id="user_created_at"
                      required
                      value={formData.user_created_at}
                      onChange={(e) => setFormData({ ...formData, user_created_at: e.target.value })}
                      className="text-input font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="form-action-footer">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={Zap}
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Executing Inference...' : 'Predict AI Coding Agent'}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Prediction Result Output Column */}
        <div className="result-column">
          {result ? (
            <GlassCard glow className="prediction-result-card animate-fade-in">
              <div className="result-badge-top">
                <span className="inference-status-tag">
                  <CheckCircle2 size={14} />
                  <span>Inference Success</span>
                </span>
                {savedToHistory && (
                  <span className="inference-status-tag font-mono" style={{ background: 'rgba(168, 85, 247, 0.12)', borderColor: 'rgba(168, 85, 247, 0.3)', color: '#c084fc' }}>
                    <Database size={13} />
                    <span>Saved to History</span>
                  </span>
                )}
                <span className="latency-badge font-mono">
                  {result.latencyMs}ms roundtrip
                </span>
              </div>

              <div className="result-main">
                <span className="result-label-sub">Predicted AI Coding Agent</span>
                <h2
                  className="result-agent-name"
                  style={{ color: predictedProfile?.color || 'var(--accent-cyan)' }}
                >
                  {predictedProfile?.name || result.predicted_agent}
                </h2>
                <div
                  className="agent-category-badge font-mono"
                  style={{
                    backgroundColor: predictedProfile?.bgColor || 'rgba(6, 182, 212, 0.1)',
                    borderColor: predictedProfile?.borderColor || 'rgba(6, 182, 212, 0.3)',
                    color: predictedProfile?.color || 'var(--accent-cyan)'
                  }}
                >
                  {predictedProfile?.badge || 'AI Assistant'}
                </div>
              </div>

              <div className="agent-description-box">
                <h4 className="box-title">Agent Profile & Workflow Signature</h4>
                <p className="box-content">
                  {predictedProfile?.description || 'Classified based on PR vocabulary, developer metrics, and timing signatures.'}
                </p>
                <div className="company-badge font-mono">
                  Origin: <span>{predictedProfile?.company || 'Verified Frontier Model'}</span>
                </div>
              </div>

              {/* Exact Response Raw Payload Accordion */}
              <div className="raw-payload-accordion">
                <button
                  type="button"
                  className="accordion-toggle-btn"
                  onClick={() => setShowRawPayload(!showRawPayload)}
                >
                  <span>Inspect Exact API Response & Payload</span>
                  {showRawPayload ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showRawPayload && (
                  <div className="raw-json-block font-mono">
                    <div className="json-sub-header">FastAPI Response:</div>
                    <pre>{JSON.stringify({ predicted_agent: result.predicted_agent }, null, 2)}</pre>
                    <div className="json-sub-header" style={{ marginTop: '0.75rem' }}>Transmitted Payload (10 fields):</div>
                    <pre>{JSON.stringify(result.payload, null, 2)}</pre>
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="result-placeholder-card">
              <div className="placeholder-icon-circle">
                <Bot size={36} />
              </div>
              <h3 className="placeholder-title">Awaiting Inference Input</h3>
              <p className="placeholder-desc">
                Fill in the pull request attributes or select one of the test presets above, then click
                <strong> "Predict AI Coding Agent"</strong> to execute the live XGBoost model.
              </p>
              <div className="supported-agents-pill-list">
                <span className="supported-label font-mono">Trained Agent Classes:</span>
                <div className="agent-tags">
                  {Object.keys(AGENT_PROFILES).map((agentKey) => (
                    <span key={agentKey} className="agent-tag font-mono">
                      {agentKey}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
