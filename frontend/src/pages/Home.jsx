import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Database, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  GitPullRequest, 
  Code2, 
  Cpu, 
  Server
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import BackendStatus from '../components/common/BackendStatus';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge-wrapper">
            <span className="hero-badge">
              <Sparkles size={14} className="hero-badge-icon" />
              <span>Production ML Engine Deployed</span>
            </span>
            <BackendStatus />
          </div>

          <h1 className="hero-title">
            AI-Assisted Software Engineering{' '}
            <span className="gradient-text">Analytics</span> &{' '}
            <span className="gradient-text-purple">Predictive Modeling</span>
          </h1>

          <p className="hero-subtitle">
            Harnessing end-to-end machine learning pipelines trained on over 2.7 million pull requests
            and 320,000 repositories. Detect AI coding agents and forecast software repository popularity
            with extreme precision.
          </p>

          <div className="hero-cta-group">
            <Link to="/predict-agent">
              <Button variant="primary" size="lg" icon={Bot}>
                Identify AI Agent
              </Button>
            </Link>
            <Link to="/predict-stars">
              <Button variant="outline" size="lg" icon={Star}>
                Predict Repository Stars
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg">
                Methodology & Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Production Models Feature Cards */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Production <span className="gradient-text">Inference Models</span>
            </h2>
            <p className="section-subtitle">
              Trained, optimized, and served live via high-performance FastAPI on Render Cloud.
            </p>
          </div>

          <div className="features-grid">
            {/* Model 1 Card */}
            <GlassCard hoverEffect glow className="feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-wrapper agent-icon-bg">
                  <Bot size={28} />
                </div>
                <span className="model-status-pill">Model 1 • Deployed</span>
              </div>

              <h3 className="feature-title">AI Coding Agent Identification</h3>
              <p className="feature-description">
                Multiclass classifier evaluating PR title/body text semantics, developer engagement metrics,
                and creation timestamps to classify whether a contribution was assisted by Claude Code,
                Cursor, Devin, Copilot, Google Jules, or Codex.
              </p>

              <div className="feature-metrics-grid">
                <div className="feature-metric">
                  <span className="metric-label">Algorithm</span>
                  <span className="metric-value font-mono">XGBoost Classifier</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Macro F1 Score</span>
                  <span className="metric-value font-mono text-emerald">99.43%</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Feature Dimension</span>
                  <span className="metric-value font-mono">5,330 features</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Target Classes</span>
                  <span className="metric-value font-mono">6 AI Assistants</span>
                </div>
              </div>

              <Link to="/predict-agent" className="feature-link">
                <span>Launch Agent Classifier</span>
                <ArrowRight size={16} />
              </Link>
            </GlassCard>

            {/* Model 2 Card */}
            <GlassCard hoverEffect glow className="feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-wrapper stars-icon-bg">
                  <Star size={28} />
                </div>
                <span className="model-status-pill">Model 2 • Deployed</span>
              </div>

              <h3 className="feature-title">Repository Popularity Prediction</h3>
              <p className="feature-description">
                High-dimensional regression forecasting GitHub star volume based on repository software license,
                primary programming language, fork frequency, fork status, and repository namespace telemetry.
              </p>

              <div className="feature-metrics-grid">
                <div className="feature-metric">
                  <span className="metric-label">Algorithm</span>
                  <span className="metric-value font-mono">KNN Regressor (k=5)</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Training Size</span>
                  <span className="metric-value font-mono text-cyan">261,438 Repos</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Feature Dimension</span>
                  <span className="metric-value font-mono">416,751 features</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Target</span>
                  <span className="metric-value font-mono">Continuous Stars</span>
                </div>
              </div>

              <Link to="/predict-stars" className="feature-link">
                <span>Launch Popularity Predictor</span>
                <ArrowRight size={16} />
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Dataset & Architecture Highlights */}
      <section className="stats-section">
        <div className="container">
          <GlassCard className="stats-glass-container">
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon-wrapper">
                  <GitPullRequest size={22} className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number font-mono">2.7M+</span>
                  <span className="stat-title">Pull Requests Analyzed</span>
                  <span className="stat-sub">Spanning all major coding agents</span>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon-wrapper">
                  <Database size={22} className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number font-mono">320K+</span>
                  <span className="stat-title">Repositories Mined</span>
                  <span className="stat-sub">Across 300+ programming languages</span>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon-wrapper">
                  <TrendingUp size={22} className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number font-mono">99.76%</span>
                  <span className="stat-title">Test Accuracy</span>
                  <span className="stat-sub">Validated on unseen test splits</span>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon-wrapper">
                  <Server size={22} className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number font-mono">&lt; 500ms</span>
                  <span className="stat-title">Live API Latency</span>
                  <span className="stat-sub">FastAPI async inference pipeline</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Analytical Workflow Overview */}
      <section className="workflow-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Engineering <span className="gradient-text">Pipeline Flow</span>
            </h2>
            <p className="section-subtitle">
              From raw developer telemetry to sparse vector spaces and instant cloud predictions.
            </p>
          </div>

          <div className="workflow-steps-grid">
            <div className="workflow-step">
              <div className="step-number font-mono">01</div>
              <h4 className="step-title">Raw Developer Telemetry</h4>
              <p className="step-desc">
                Extracting textual semantics, metadata counts, and account timestamps from GitHub activity.
              </p>
            </div>

            <div className="workflow-step">
              <div className="step-number font-mono">02</div>
              <h4 className="step-title">Sparse Feature Engineering</h4>
              <p className="step-desc">
                TF-IDF n-gram vectorization, median numerical imputation, standard scaling, and sparse one-hot encoding.
              </p>
            </div>

            <div className="workflow-step">
              <div className="step-number font-mono">03</div>
              <h4 className="step-title">Model Inference</h4>
              <p className="step-desc">
                Scikit-learn KNN and XGBoost inference executed in float32 sparse matrix space.
              </p>
            </div>

            <div className="workflow-step">
              <div className="step-number font-mono">04</div>
              <h4 className="step-title">Actionable Analytics</h4>
              <p className="step-desc">
                Real-time predictions returned with full payload traceability and persistent session history.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
