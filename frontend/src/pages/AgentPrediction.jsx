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
      setError({ title: 'Please Check Your Input', message: 'Pull Request title is required.' });
      return false;
    }
    if (!formData.body.trim()) {
      setError({ title: 'Please Check Your Input', message: 'Pull Request description is required.' });
      return false;
    }
    if (!formData.language) {
      setError({ title: 'Please Check Your Input', message: 'Please select a programming language.' });
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
            <span>AI Assistant Identification • High Accuracy</span>
          </div>
          <h1 className="page-main-title">
            Identify the AI <span className="gradient-text">Assistant</span>
          </h1>
          <p className="page-lead-desc">
            Enter information about a pull request and we'll estimate which AI coding assistant was most likely used.
          </p>
        </div>
        <BackendStatus />
      </div>

      {/* Preset Action Bar */}
      <div className="preset-bar">
        <span className="preset-bar-label">
          <Sparkles size={15} />
          <span>Try a Sample Pull Request:</span>
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
            <strong>Connecting to our analysis service...</strong>
            <span>The cloud service may take a minute to wake up if it has not been active recently. Thank you for your patience!</span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          <AlertCircle size={20} className="error-icon" />
          <div className="error-content">
            <h4>{error.title || 'Prediction Notice'}</h4>
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
              {/* Section 1: Pull Request Information */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <Code2 size={18} />
                  <span>Pull Request Details</span>
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
                    placeholder="e.g. feat(api): implement user verification and token refresh"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-input"
                  />
                </div>

                <div className="input-field-group">
                  <div className="label-row">
                    <label htmlFor="body" className="input-label">Pull Request Description *</label>
                    <span className="char-count font-mono">{formData.body.length} chars</span>
                  </div>
                  <textarea
                    id="body"
                    required
                    rows={6}
                    placeholder="e.g. Added user token generator, updated middleware, created test suite covering token expiration..."
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className="text-input text-area"
                  />
                </div>
              </div>

              {/* Section 2: Repository Details */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <GitFork size={18} />
                  <span>Repository Details</span>
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
                      <optgroup label="All Supported Languages (316)">
                        {ALL_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="input-field-group toggle-group">
                    <label className="input-label">Is this a Forked Repository?</label>
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
                        {formData.is_forked ? 'Yes (Fork)' : 'No (Original)'}
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

              {/* Section 3: Author & Timeline Details */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <Users size={18} />
                  <span>Author & Timeline Details</span>
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
                    <label htmlFor="created_at" className="input-label">Pull Request Date & Time *</label>
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
                    <label htmlFor="user_created_at" className="input-label">Author Account Created Date *</label>
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
                  {loading ? 'Analyzing Your Information...' : 'Identify AI Assistant'}
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
                  <span>Analysis Complete</span>
                </span>
                {savedToHistory && (
                  <span className="inference-status-tag font-mono" style={{ background: 'rgba(168, 85, 247, 0.12)', borderColor: 'rgba(168, 85, 247, 0.3)', color: '#c084fc' }}>
                    <Database size={13} />
                    <span>Saved to History</span>
                  </span>
                )}
                <span className="latency-badge font-mono">
                  {result.latencyMs}ms response time
                </span>
              </div>

              <div className="result-main">
                <span className="result-label-sub">Likely AI Assistant</span>
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
                <h4 className="box-title">About this Assistant</h4>
                <p className="box-content">
                  {predictedProfile?.description || 'Classified based on pull request writing style, details, and project timing.'}
                </p>
                <div className="company-badge font-mono">
                  Created By: <span>{predictedProfile?.company || 'Verified Frontier Model'}</span>
                </div>
              </div>

              {/* Exact Response Raw Payload Accordion */}
              <div className="raw-payload-accordion">
                <button
                  type="button"
                  className="accordion-toggle-btn"
                  onClick={() => setShowRawPayload(!showRawPayload)}
                >
                  <span>View Technical Details</span>
                  {showRawPayload ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showRawPayload && (
                  <div className="raw-json-block font-mono">
                    <div className="json-sub-header">Prediction Output:</div>
                    <pre>{JSON.stringify({ predicted_agent: result.predicted_agent }, null, 2)}</pre>
                    <div className="json-sub-header" style={{ marginTop: '0.75rem' }}>Submitted Information:</div>
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
              <h3 className="placeholder-title">Ready for Your Input</h3>
              <p className="placeholder-desc">
                Fill in the pull request details or choose a sample pull request above, then click
                <strong> "Identify AI Assistant"</strong> to see the prediction.
              </p>
              <div className="supported-agents-pill-list">
                <span className="supported-label font-mono">Recognized AI Assistants:</span>
                <div className="agent-tags">
                  {Object.keys(AGENT_PROFILES).map((agentKey) => (
                    <span key={agentKey} className="agent-tag font-mono">
                      {AGENT_PROFILES[agentKey]?.name || agentKey}
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
