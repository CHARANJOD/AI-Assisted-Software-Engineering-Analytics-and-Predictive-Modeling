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
              <span>AI-Powered Software Insights</span>
            </span>
            <BackendStatus />
          </div>

          <h1 className="hero-title">
            AI-Assisted Software Engineering{' '}
            <span className="gradient-text">Analytics</span> &{' '}
            <span className="gradient-text-purple">Predictive Insights</span>
          </h1>

          <p className="hero-subtitle">
            Understand your software development data with simple AI-powered predictions.
            Find out which AI assistant contributed to code and estimate how popular a repository can become.
          </p>

          <div className="hero-cta-group">
            <Link to="/predict-agent">
              <Button variant="primary" size="lg" icon={Bot}>
                Identify AI Assistant
              </Button>
            </Link>
            <Link to="/predict-stars">
              <Button variant="outline" size="lg" icon={Star}>
                Estimate Repository Popularity
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              What You Can <span className="gradient-text">Do Here</span>
            </h2>
            <p className="section-subtitle">
              Explore simple, powerful prediction tools trained on hundreds of thousands of open-source projects.
            </p>
          </div>

          <div className="features-grid">
            {/* Tool 1 Card */}
            <GlassCard hoverEffect glow className="feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-wrapper agent-icon-bg">
                  <Bot size={28} />
                </div>
                <span className="model-status-pill">AI Assistant Tool</span>
              </div>

              <h3 className="feature-title">Identify the AI Assistant</h3>
              <p className="feature-description">
                Find out which AI coding assistant was most likely used for a pull request by providing
                basic details like the pull request title, description, and repository statistics.
              </p>

              <div className="feature-metrics-grid">
                <div className="feature-metric">
                  <span className="metric-label">Confidence</span>
                  <span className="metric-value font-mono text-emerald">99.4% Accuracy</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Supported</span>
                  <span className="metric-value font-mono">6 Major Assistants</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Speed</span>
                  <span className="metric-value font-mono">&lt; 1 Second</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Input Needed</span>
                  <span className="metric-value font-mono">PR Title & Details</span>
                </div>
              </div>

              <Link to="/predict-agent" className="feature-link">
                <span>Identify AI Assistant</span>
                <ArrowRight size={16} />
              </Link>
            </GlassCard>

            {/* Tool 2 Card */}
            <GlassCard hoverEffect glow className="feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-wrapper stars-icon-bg">
                  <Star size={28} />
                </div>
                <span className="model-status-pill">Popularity Tool</span>
              </div>

              <h3 className="feature-title">Estimate Repository Popularity</h3>
              <p className="feature-description">
                Get an estimate of how popular a GitHub repository may become based on its characteristics,
                such as software license, primary programming language, and fork activity.
              </p>

              <div className="feature-metrics-grid">
                <div className="feature-metric">
                  <span className="metric-label">Benchmark Basis</span>
                  <span className="metric-value font-mono text-cyan">260K+ Repositories</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Result</span>
                  <span className="metric-value font-mono">Estimated Star Count</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Speed</span>
                  <span className="metric-value font-mono">Instant Analysis</span>
                </div>
                <div className="feature-metric">
                  <span className="metric-label">Input Needed</span>
                  <span className="metric-value font-mono">Language & License</span>
                </div>
              </div>

              <Link to="/predict-stars" className="feature-link">
                <span>Estimate Repository Popularity</span>
                <ArrowRight size={16} />
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Dataset & Performance Highlights */}
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
                  <span className="stat-sub">From leading open-source software</span>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon-wrapper">
                  <Database size={22} className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number font-mono">320K+</span>
                  <span className="stat-title">Repositories Evaluated</span>
                  <span className="stat-sub">Across 300+ programming languages</span>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon-wrapper">
                  <TrendingUp size={22} className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number font-mono">99.76%</span>
                  <span className="stat-title">Validation Accuracy</span>
                  <span className="stat-sub">Tested on real-world projects</span>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon-wrapper">
                  <Server size={22} className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number font-mono">&lt; 500ms</span>
                  <span className="stat-title">Fast Response Time</span>
                  <span className="stat-sub">Instant cloud-powered analysis</span>
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
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="section-subtitle">
              A simple 4-step process from entering basic details to receiving instant, actionable insights.
            </p>
          </div>

          <div className="workflow-steps-grid">
            <div className="workflow-step">
              <div className="step-number font-mono">01</div>
              <h4 className="step-title">Enter Project Details</h4>
              <p className="step-desc">
                Provide basic information about your pull request or repository, such as title, language, or forks.
              </p>
            </div>

            <div className="workflow-step">
              <div className="step-number font-mono">02</div>
              <h4 className="step-title">Automatic Analysis</h4>
              <p className="step-desc">
                Our system instantly analyzes your input patterns and context without requiring complex setup.
              </p>
            </div>

            <div className="workflow-step">
              <div className="step-number font-mono">03</div>
              <h4 className="step-title">Pattern Comparison</h4>
              <p className="step-desc">
                Your input is compared against patterns learned from hundreds of thousands of open-source projects.
              </p>
            </div>

            <div className="workflow-step">
              <div className="step-number font-mono">04</div>
              <h4 className="step-title">Your Results</h4>
              <p className="step-desc">
                Receive clear predictions right away, explore key details, and view your prediction history anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
