import React, { useState } from 'react';
import { Mail, Github, MessageSquare, Send, CheckCircle2, ExternalLink, Terminal, MapPin } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Feedback',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate feedback submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Feedback', message: '' });
    }, 600);
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <div className="contact-header">
          <div className="contact-badge">
            <Mail size={14} />
            <span>Support & Connect</span>
          </div>
          <h1 className="contact-title">
            Get in Touch & <span className="gradient-text">Share Feedback</span>
          </h1>
          <p className="contact-subtitle">
            Have questions about predictions, ideas for improvement, or need assistance?
            Reach out directly or explore our open-source project.
          </p>
        </div>

        <div className="contact-layout">
          {/* Left Column: Form */}
          <GlassCard className="contact-form-card">
            <h3 className="form-card-title">Send a Message</h3>
            <p className="form-card-desc">
              Fill in the form below and we will review your message promptly.
            </p>

            {submitted ? (
              <div className="submission-success">
                <CheckCircle2 size={42} className="success-icon" />
                <h4>Message Received</h4>
                <p>Thank you for reaching out! We appreciate your engagement with our analytics platform.</p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Chen"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@example.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Topic</label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input form-select"
                  >
                    <option value="General Feedback">General Feedback</option>
                    <option value="Prediction Question">Prediction Question</option>
                    <option value="Technical Question">Technical Question</option>
                    <option value="Bug Report">Bug Report</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message / Details</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question or feedback..."
                    className="form-input form-textarea"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" icon={Send} loading={loading}>
                  Send Message
                </Button>
              </form>
            )}
          </GlassCard>

          {/* Right Column: Project Info & Links */}
          <div className="contact-info-col">
            <GlassCard className="info-card">
              <h3 className="info-card-title">Project Resources</h3>
              <p className="info-card-desc">
                The open-source codebase, interactive documentation, and project details are publicly accessible.
              </p>

              <div className="info-links-list">
                <a
                  href="https://github.com/CHARANJOD/AI-Assisted-Software-Engineering-Analytics-and-Predictive-Modeling"
                  target="_blank"
                  rel="noreferrer"
                  className="info-link-item"
                >
                  <div className="info-link-icon">
                    <Github size={20} />
                  </div>
                  <div className="info-link-text">
                    <span className="info-link-title">GitHub Repository</span>
                    <span className="info-link-sub">CHARANJOD / AI-Assisted-SE-Analytics</span>
                  </div>
                  <ExternalLink size={16} className="info-link-arrow" />
                </a>

                <a
                  href="https://ai-assisted-software-engineering.onrender.com/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="info-link-item"
                >
                  <div className="info-link-icon">
                    <Terminal size={20} />
                  </div>
                  <div className="info-link-text">
                    <span className="info-link-title">API Documentation</span>
                    <span className="info-link-sub">Interactive endpoints and documentation</span>
                  </div>
                  <ExternalLink size={16} className="info-link-arrow" />
                </a>
              </div>
            </GlassCard>

            <GlassCard className="info-card meta-card">
              <h4 className="meta-card-title">Platform Summary</h4>
              <div className="meta-list font-mono">
                <div className="meta-row">
                  <span className="meta-key">Cloud Hosting:</span>
                  <span className="meta-val">Render Cloud Deployment</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Analysis Tools:</span>
                  <span className="meta-val">AI Assistant & Popularity Prediction</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Response Speed:</span>
                  <span className="meta-val">Real-time live processing</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
