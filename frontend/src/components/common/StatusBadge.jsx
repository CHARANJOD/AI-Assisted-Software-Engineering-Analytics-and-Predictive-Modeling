import React from 'react';
import './StatusBadge.css';

export default function StatusBadge({
  status = 'online',
  label,
  pulse = false,
  className = ''
}) {
  const badgeClasses = [
    'status-badge',
    `status-${status}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses}>
      <span className={`status-dot ${pulse ? 'pulse-dot' : ''}`} />
      <span className="status-label">{label || status}</span>
    </span>
  );
}
