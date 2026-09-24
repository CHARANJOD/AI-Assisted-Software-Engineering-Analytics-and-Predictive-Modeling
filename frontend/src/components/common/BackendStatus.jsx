import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, RefreshCw } from 'lucide-react';
import StatusBadge from './StatusBadge';
import './BackendStatus.css';

export default function BackendStatus({ className = '' }) {
  const [status, setStatus] = useState('checking'); // checking | online | warming | offline
  const [latency, setLatency] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const checkStatus = async () => {
    setIsRetrying(true);
    const startTime = performance.now();
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://ai-assisted-software-engineering.onrender.com';

    try {
      // Set a 15s timeout for healthcheck
      const response = await axios.get(apiUrl, { timeout: 15000 });
      const elapsed = Math.round(performance.now() - startTime);
      setLatency(elapsed);

      if (response.status === 200) {
        setStatus('online');
      } else {
        setStatus('warning');
      }
    } catch (err) {
      // If network error or timeout, check if it was timeout (likely warming up on Render)
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setStatus('warming');
      } else {
        setStatus('offline');
      }
      setLatency(null);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusDetails = () => {
    switch (status) {
      case 'online':
        return {
          type: 'online',
          text: `Service Ready ${latency ? `(${latency}ms)` : ''}`,
          pulse: true
        };
      case 'warming':
        return {
          type: 'warming',
          text: 'Connecting to service (warming up)...',
          pulse: true
        };
      case 'offline':
        return {
          type: 'offline',
          text: 'Service Unavailable',
          pulse: false
        };
      default:
        return {
          type: 'warming',
          text: 'Checking service...',
          pulse: true
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div className={`backend-status-container ${className}`}>
      <StatusBadge
        status={details.type}
        label={details.text}
        pulse={details.pulse}
      />
      <button
        type="button"
        className={`status-refresh-btn ${isRetrying ? 'spinning' : ''}`}
        onClick={checkStatus}
        title="Refresh service status"
        aria-label="Refresh service status"
      >
        <RefreshCw size={13} />
      </button>
    </div>
  );
}
