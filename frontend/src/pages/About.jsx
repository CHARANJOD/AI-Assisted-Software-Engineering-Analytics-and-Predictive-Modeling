import React from 'react';
import { 
  BookOpen, 
  Cpu, 
  Layers, 
  Database, 
  CheckCircle2, 
  Clock, 
  GitPullRequest, 
  Star, 
  Code2, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import './About.css';

export default function About() {
  const problems = [
    {
      id: 'Problem 1',
      title: 'AI Coding Agent Identification',
      type: 'Multiclass Classification',
      target: 'agent',
      status: 'Production Active',
      active: true,
      algorithm: 'XGBoost Classifier',
      features: '5,330 features (TF-IDF text + One-Hot + Scaled numerical)',
      description:
        'Classifies which AI assistant authored or assisted with a GitHub pull request (Claude Code, Copilot, Cursor, Devin, Google Jules, OpenAI Codex). Achieves 99.43% Macro F1 score on unseen test sets.'
    },
    {
      id: 'Problem 2',
      title: 'Repository Popularity Prediction',
      type: 'Regression',
      target: 'stars',
      status: 'Production Active',
      active: true,
      algorithm: 'KNN Regressor (k=5)',
      features: '416,751 features (High-dimensional sparse categorical + numerical)',
      description:
        'Forecasts total GitHub star count from repository-level license, programming language, fork count, and namespace telemetry across 261,438 training repositories.'
    },
    {
      id: 'Problem 3',
      title: 'Pull Request Merge Prediction',
      type: 'Binary Classification',
      target: 'merged',
      status: 'Research / Analytical Phase',
      active: false,
      algorithm: 'Derived from merged_at',
      features: 'PR metadata, size, review comments, author reputation',
      description:
        'Exploratory classification model predicting whether a contribution will be successfully accepted and merged into the main branch.'
    },
    {
      id: 'Problem 4',
      title: 'Pull Request Merge Duration Prediction',
      type: 'Regression',
      target: 'time_to_merge_hours',
      status: 'Research / Analytical Phase',
      active: false,
      algorithm: 'Derived from (merged_at - created_at)',
      features: 'Contribution size, author account age, repository activity',
      description:
        'Forecasting the elapsed turnaround time in hours required for maintainers to evaluate and merge an incoming pull request.'
    },
    {
      id: 'Problem 5',
      title: 'Pull Request State Prediction',
      type: 'Binary Classification',
      target: 'state',
      status: 'Research / Analytical Phase',
      active: false,
      algorithm: 'Classification on lifecycle state',
      features: 'PR complexity, commit volume, interaction velocity',
      description:
        'Classifying final pull request lifecycle state (open, closed, or merged) based on early contribution indicators.'
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Header */}
        <div className="about-header">
          <div className="about-badge">
            <BookOpen size={14} />
            <span>Architecture & Methodology</span>
          </div>
          <h1 className="about-title">
            Engineering Telemetry & <span className="gradient-text">Predictive ML Architecture</span>
          </h1>
          <p className="about-subtitle">
            An empirical investigation into software engineering workflows, AI coding agent adoption,
            and software repository growth metrics using large-scale machine learning pipelines.
          </p>
        </div>

        {/* The 5 ML Problems Overview */}
        <section className="about-section">
          <h2 className="section-heading">
            <Layers size={22} className="heading-icon" />
            <span>The Five Machine Learning Problem Statements</span>
          </h2>
          <p className="section-lead">
            The project research framework established five core machine learning objectives. In the current production release,
            <strong> Problems 1 and 2</strong> are trained, validated, saved, and served live via the FastAPI backend on Render.
          </p>

          <div className="problems-grid">
            {problems.map((p) => (
              <GlassCard key={p.id} className={`problem-card ${p.active ? 'problem-card-active' : 'problem-card-research'}`}>
                <div className="problem-card-top">
                  <span className="problem-id font-mono">{p.id}</span>
                  <span className={`status-tag font-mono ${p.active ? 'tag-active' : 'tag-research'}`}>
                    {p.status}
                  </span>
                </div>

                <h3 className="problem-title">{p.title}</h3>
                <div className="problem-meta font-mono">
                  <span><strong>Type:</strong> {p.type}</span>
                  <span>•</span>
                  <span><strong>Target:</strong> {p.target}</span>
                </div>

                <p className="problem-desc">{p.description}</p>

                <div className="problem-specs">
                  <div className="spec-row">
                    <span className="spec-label">Algorithm:</span>
                    <span className="spec-val font-mono">{p.algorithm}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Features:</span>
                    <span className="spec-val font-mono">{p.features}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Feature Engineering Deep Dive */}
        <section className="about-section">
          <h2 className="section-heading">
            <Cpu size={22} className="heading-icon" />
            <span>Production Feature Engineering & Preprocessing</span>
          </h2>

          <div className="pipeline-grid">
            <GlassCard className="pipeline-card">
              <div className="pipeline-card-badge">P1 Pipeline</div>
              <h3>AI Agent Vector Space (5,330 features)</h3>
              <ul className="pipeline-steps">
                <li>
                  <strong>Text Semantics:</strong> Sublinear TF-IDF vectorization on PR title (2,000 unigrams) and body text (3,000 unigrams).
                </li>
                <li>
                  <strong>Temporal Decomposition:</strong> Derivation of <code>created_year</code>, <code>created_month</code>, <code>created_dayofweek</code>, and <code>created_hour</code>.
                </li>
                <li>
                  <strong>Developer Tenure:</strong> Calculating <code>user_account_age_days</code> from GitHub account creation timestamp.
                </li>
                <li>
                  <strong>Categorical Encoding:</strong> One-hot encoding of 316 programming languages and fork status into 319 sparse columns.
                </li>
                <li>
                  <strong>Median Imputation & Scaling:</strong> 11 numerical features imputed via median strategy and standard-scaled ($z$-score).
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="pipeline-card">
              <div className="pipeline-card-badge">P2 Pipeline</div>
              <h3>Repository Popularity Space (416,751 features)</h3>
              <ul className="pipeline-steps">
                <li>
                  <strong>Namespace Decomposition:</strong> Automatic derivation of repository owner and repository short name from namespace telemetry.
                </li>
                <li>
                  <strong>Namespace Length Metric:</strong> Exact character count computation of <code>{`${'owner'}/${'repo'}`}.length</code>.
                </li>
                <li>
                  <strong>Sparse Categorical Encoders:</strong> High-cardinality One-Hot Encoding across 42 software licenses, 306 programming languages, and over 400,000 repository owner/name tokens.
                </li>
                <li>
                  <strong>K-Nearest Neighbors Search:</strong> Regressor ($k=5$, Minkowski Euclidean distance) evaluated against 261,438 training instances.
                </li>
              </ul>
            </GlassCard>
          </div>
        </section>
      </div>
    </div>
  );
}
