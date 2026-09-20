import React from 'react';
import './GlassCard.css';

export default function GlassCard({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
  style = {}
}) {
  const cardClasses = [
    'glass-card',
    hoverEffect ? 'glass-card-hover' : '',
    glow ? 'glass-card-glow' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} style={style}>
      {children}
    </div>
  );
}
