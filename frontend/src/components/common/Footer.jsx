import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Github, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="container footer-content">
        {/* Left Column: Brand & Info */}
        <div className="footer-col footer-col-brand">
          <div className="footer-brand">
            <Cpu size={20} className="footer-brand-icon" />
            <span className="footer-brand-title">
              AI-SE <span className="gradient-text">Analytics</span>
            </span>
          </div>
          <p className="footer-description">
            Intelligent analytics platform to understand software projects,
            identify AI coding assistants, and estimate repository popularity.
          </p>
          <div className="footer-badge-wrapper">
            <span className="engine-badge">
              <ShieldCheck size={14} className="engine-badge-icon" />
              <span>Cloud Powered & Secure</span>
            </span>
          </div>
        </div>

        {/* Center-Left Column: Navigation */}
        <div className="footer-col">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/predict-agent">AI Assistant</Link></li>
            <li><Link to="/predict-stars">Repository Popularity</Link></li>
            <li><Link to="/history">Prediction History</Link></li>
          </ul>
        </div>

        {/* Center-Right Column: Features & Docs */}
        <div className="footer-col">
          <h4 className="footer-heading">Core Capabilities</h4>
          <ul className="footer-links">
            <li>
              <span className="footer-model-tag">Tool 1</span>
              <span>AI Assistant Identification</span>
            </li>
            <li>
              <span className="footer-model-tag">Tool 2</span>
              <span>Repository Popularity Estimation</span>
            </li>
            <li>
              <a
                href="https://ai-assisted-software-engineering.onrender.com/docs"
                target="_blank"
                rel="noreferrer"
                className="external-link"
              >
                <span>API Documentation</span>
                <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>

        {/* Right Column: About & Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-links">
            <li><Link to="/about">About & Methodology</Link></li>
            <li><Link to="/contact">Support & Contact</Link></li>
            <li>
              <a
                href="https://github.com/CHARANJOD/AI-Assisted-Software-Engineering-Analytics-and-Predictive-Modeling"
                target="_blank"
                rel="noreferrer"
                className="external-link"
              >
                <Github size={14} />
                <span>GitHub Repository</span>
                <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-bottom-content">
          <p>© {currentYear} AI-Assisted Software Engineering Analytics. All rights reserved.</p>
          <div className="footer-bottom-meta">
            <span>Smart Development Analytics</span>
            <span className="meta-separator">•</span>
            <span>Real-Time Cloud Predictions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
