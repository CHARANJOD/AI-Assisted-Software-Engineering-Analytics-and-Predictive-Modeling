import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Sparkles, 
  Send, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  GitBranch, 
  Shield, 
  Code, 
  Zap, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Hash,
  Database
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import BackendStatus from '../components/common/BackendStatus';
import { predictStars } from '../services/apiService';
import { POPULAR_LICENSES, ALL_LICENSES } from '../data/licenses';
import { POPULAR_LANGUAGES, ALL_LANGUAGES } from '../data/languages';
import { STARS_PRESETS } from '../data/samplePresets';
import { useAuth } from '../context/AuthContext';
import { savePrediction } from '../services/firestore';
import './StarsPrediction.css';

export default function StarsPrediction() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    repository_owner: '',
    repository_name: '',
    license: 'MIT',
    language: 'Python',
    forks: 0,
    is_forked: false
  });

  const [loading, setLoading] = useState(false);
  const [coldStartNotice, setColdStartNotice] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showRawPayload, setShowRawPayload] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [savedToHistory, setSavedToHistory] = useState(false);

  // Exact Rule: repository_name_length = `${repository_owner}/${repository_name}`.length
  const computedNameLength = formData.repository_owner && formData.repository_name
    ? `${formData.repository_owner.trim()}/${formData.repository_name.trim()}`.length
    : 0;

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
    setFormData(preset.data);
    setSavedToHistory(false);
    setError(null);
  };

  const handleReset = () => {
    setFormData({
      repository_owner: '',
      repository_name: '',
      license: 'MIT',
      language: 'Python',
      forks: 0,
      is_forked: false
    });
    setActivePreset(null);
    setResult(null);
    setSavedToHistory(false);
    setError(null);
  };

  const validateForm = () => {
    if (!formData.repository_owner.trim()) {
      setError({ title: 'Please Check Your Input', message: 'Repository Owner is required.' });
      return false;
    }
    if (!formData.repository_name.trim()) {
      setError({ title: 'Please Check Your Input', message: 'Repository Name is required.' });
      return false;
    }
    if (!formData.license) {
      setError({ title: 'Please Check Your Input', message: 'Please select a software license.' });
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
      const response = await predictStars(formData);
      setResult(response);

      // Save to Firestore for authenticated user
      if (user?.uid) {
        try {
          await savePrediction(user.uid, {
            modelType: 'stars',
            input: response.payload,
            output: { predicted_stars: response.predicted_stars }
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

  // Determine popularity tier
  const getPopularityTier = (stars) => {
    if (stars >= 5000) return { name: 'Platinum Tier', badgeClass: 'tier-platinum', desc: 'Widely recognized and essential open-source project' };
    if (stars >= 500) return { name: 'Gold Tier', badgeClass: 'tier-gold', desc: 'High-impact community project with strong adoption' };
    if (stars >= 50) return { name: 'Silver Tier', badgeClass: 'tier-silver', desc: 'Active library with emerging community interest' };
    return { name: 'Bronze Tier', badgeClass: 'tier-bronze', desc: 'Niche, personal, or early-stage software project' };
  };

  const tier = result ? getPopularityTier(result.predicted_stars) : null;

  return (
    <div className="stars-prediction-page container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-pre-title" style={{ color: 'var(--accent-amber)' }}>
            <Star size={16} />
            <span>Repository Popularity Prediction • Benchmarked on 260K+ Repos</span>
          </div>
          <h1 className="page-main-title">
            Estimate Repository <span className="gradient-text">Popularity</span>
          </h1>
          <p className="page-lead-desc">
            Enter a few details about a GitHub repository to get an estimated star count based on data from over 260,000 open-source projects.
          </p>
        </div>
        <BackendStatus />
      </div>

      {/* Preset Action Bar */}
      <div className="preset-bar">
        <span className="preset-bar-label" style={{ color: 'var(--accent-amber)' }}>
          <Sparkles size={15} />
          <span>Try a Sample Repository:</span>
        </span>
        <div className="preset-chips">
          {STARS_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preset-chip ${activePreset === preset.id ? 'preset-chip-amber-active' : ''}`}
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
            <span>Please allow a minute to start up if it has not been used recently. Thank you for your patience!</span>
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
            <form onSubmit={handleSubmit} className="stars-form">
              {/* Section 1: Repository Details */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <GitBranch size={18} style={{ color: 'var(--accent-amber)' }} />
                  <span>Repository Details</span>
                </h3>

                <div className="input-row-2col">
                  <div className="input-field-group">
                    <label htmlFor="owner" className="input-label">Repository Owner / Organization *</label>
                    <input
                      type="text"
                      id="owner"
                      required
                      placeholder="e.g. pallets, facebook, vercel"
                      value={formData.repository_owner}
                      onChange={(e) => setFormData({ ...formData, repository_owner: e.target.value })}
                      className="text-input"
                    />
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="repo" className="input-label">Repository Name *</label>
                    <input
                      type="text"
                      id="repo"
                      required
                      placeholder="e.g. flask, react, next.js"
                      value={formData.repository_name}
                      onChange={(e) => setFormData({ ...formData, repository_name: e.target.value })}
                      className="text-input"
                    />
                  </div>
                </div>

                {/* Computed Identifier Display */}
                <div className="derived-length-pill">
                  <div className="length-info">
                    <Hash size={14} className="length-icon" />
                    <span className="length-label">Repository Path:</span>
                    <code className="length-code font-mono">
                      {formData.repository_owner && formData.repository_name
                        ? `${formData.repository_owner}/${formData.repository_name}`
                        : 'owner/repo'}
                    </code>
                  </div>
                  <span className="length-value font-mono">
                    {computedNameLength} chars
                  </span>
                </div>
              </div>

              {/* Section 2: License & Language */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <Shield size={18} style={{ color: 'var(--accent-amber)' }} />
                  <span>License & Language</span>
                </h3>

                <div className="input-row-2col">
                  <div className="input-field-group">
                    <label htmlFor="license" className="input-label">Software License *</label>
                    <select
                      id="license"
                      value={formData.license}
                      onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                      className="text-input select-input"
                    >
                      <optgroup label="Popular Licenses">
                        {POPULAR_LICENSES.map((lic) => (
                          <option key={lic} value={lic}>{lic}</option>
                        ))}
                      </optgroup>
                      <optgroup label="All Supported Licenses (42)">
                        {ALL_LICENSES.map((lic) => (
                          <option key={lic} value={lic}>{lic}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="language" className="input-label">Primary Programming Language *</label>
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
                </div>
              </div>

              {/* Section 3: Forks & Fork Status */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <TrendingUp size={18} style={{ color: 'var(--accent-amber)' }} />
                  <span>Fork Information</span>
                </h3>

                <div className="input-row-2col">
                  <div className="input-field-group">
                    <label htmlFor="forks" className="input-label">Number of Forks *</label>
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
              </div>

              {/* Submit CTA */}
              <div className="form-action-footer">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={Zap}
                  loading={loading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#1a1300'
                  }}
                >
                  {loading ? 'Estimating Popularity...' : 'Estimate Repository Stars'}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Prediction Result Column */}
        <div className="result-column">
          {result ? (
            <GlassCard glow className="stars-result-card animate-fade-in">
              <div className="result-badge-top">
                <span className="inference-status-tag-amber">
                  <CheckCircle2 size={14} />
                  <span>Estimate Complete</span>
                </span>
                {savedToHistory && (
                  <span className="inference-status-tag-amber font-mono" style={{ background: 'rgba(168, 85, 247, 0.12)', borderColor: 'rgba(168, 85, 247, 0.3)', color: '#c084fc' }}>
                    <Database size={13} />
                    <span>Saved to History</span>
                  </span>
                )}
                <span className="latency-badge font-mono">
                  {result.latencyMs}ms response time
                </span>
              </div>

              <div className="stars-result-main">
                <span className="result-label-sub">Estimated Stars</span>
                <div className="stars-number-display">
                  <Star size={32} className="stars-icon-glow" />
                  <span className="stars-value font-mono">
                    {Number(result.predicted_stars).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="stars-unit-text font-mono">Estimated Community Star Count</span>

                <div className={`tier-pill font-mono ${tier?.badgeClass}`}>
                  {tier?.name}
                </div>
              </div>

              <div className="tier-description-box">
                <h4 className="box-title">Popularity Tier</h4>
                <p className="box-content">
                  {tier?.desc}
                </p>
                <div className="computed-length-metric font-mono">
                  Repository: <strong>{result.payload?.repository_owner}/{result.payload?.repository_name}</strong>
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
                    <div className="json-sub-header">Prediction Details:</div>
                    <pre>{JSON.stringify({ predicted_stars: result.predicted_stars }, null, 2)}</pre>
                    <div className="json-sub-header" style={{ marginTop: '0.75rem' }}>Submitted Information:</div>
                    <pre>{JSON.stringify(result.payload, null, 2)}</pre>
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="result-placeholder-card">
              <div className="placeholder-icon-circle" style={{ color: 'var(--accent-amber)' }}>
                <Star size={36} />
              </div>
              <h3 className="placeholder-title">Ready for Your Input</h3>
              <p className="placeholder-desc">
                Specify the repository owner, name, license, and forks, or choose a sample repository above
                to see an estimated star count.
              </p>
              <div className="supported-agents-pill-list">
                <span className="supported-label font-mono">Benchmark Scale:</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Trained on 260,000+ open-source GitHub repositories
                </span>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
