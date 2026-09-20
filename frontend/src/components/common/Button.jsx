import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const btnClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={btnClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="btn-spinner" size={18} />
      ) : Icon ? (
        <Icon className="btn-icon" size={18} />
      ) : null}
      <span className="btn-text">{children}</span>
    </button>
  );
}
