import axios from 'axios';

// Get API base URL from environment or default to live deployed Render service
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'https://ai-assisted-software-engineering.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // 90 seconds timeout to accommodate Render free-tier cold-starts
  timeout: 90000
});

/**
 * Format API error into a friendly message
 */
export function parseApiError(error) {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      title: 'Request Timed Out',
      message: 'The cloud service is taking longer than usual to respond. Please wait a moment and try again.',
      isTimeout: true
    };
  }

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Input validation error
    if (status === 422 && data?.detail) {
      const messages = Array.isArray(data.detail)
        ? data.detail.map(d => `${d.loc ? d.loc[d.loc.length - 1] : 'Field'}: ${d.msg}`).join(', ')
        : 'Please check your inputs and try again.';

      return {
        title: 'Please Check Your Input',
        message: messages,
        isValidation: true
      };
    }

    return {
      title: 'Service Notice',
      message: data?.message || data?.detail || "We're unable to process your request right now. Please try again.",
      isServerError: true
    };
  }

  return {
    title: 'Connection Issue',
    message: "We're unable to connect to the prediction service right now. Please check your internet connection and try again.",
    isNetwork: true
  };
}

/**
 * Check backend health
 */
export async function checkHealth() {
  const start = performance.now();
  try {
    const response = await apiClient.get('/');
    const latencyMs = Math.round(performance.now() - start);
    return {
      success: true,
      message: response.data?.message || 'API is running',
      latencyMs
    };
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * Model 1: Predict AI Coding Agent from Pull Request metadata
 * Expects exactly 10 fields:
 * title, body, language, forks, stars, is_forked, followers, following, created_at, user_created_at
 */
export async function predictAgent(inputData) {
  const start = performance.now();

  // Strict payload construction and typing
  const payload = {
    title: String(inputData.title || '').trim(),
    body: String(inputData.body || '').trim(),
    language: String(inputData.language || '').trim(),
    forks: Number(parseFloat(inputData.forks) || 0),
    stars: Number(parseFloat(inputData.stars) || 0),
    is_forked: Boolean(inputData.is_forked),
    followers: Number(parseFloat(inputData.followers) || 0),
    following: Number(parseFloat(inputData.following) || 0),
    created_at: new Date(inputData.created_at).toISOString(),
    user_created_at: new Date(inputData.user_created_at).toISOString()
  };

  try {
    const response = await apiClient.post('/predict/agent', payload);
    const latencyMs = Math.round(performance.now() - start);

    return {
      predicted_agent: response.data.predicted_agent,
      latencyMs,
      payload
    };
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * Model 2: Predict Repository Popularity (Stars) from repository metadata
 * Expects exactly 7 fields:
 * license, is_forked, language, forks, repository_name_length, repository_owner, repository_name
 * Rule: repository_name_length MUST be calculated as `${repository_owner}/${repository_name}`.length
 */
export async function predictStars(inputData) {
  const start = performance.now();

  const owner = String(inputData.repository_owner || '').trim();
  const name = String(inputData.repository_name || '').trim();

  // Exact rule: length of "owner/repo" full name
  const repository_name_length = `${owner}/${name}`.length;

  const payload = {
    license: String(inputData.license || '').trim(),
    is_forked: Boolean(inputData.is_forked),
    language: String(inputData.language || '').trim(),
    forks: Number(parseFloat(inputData.forks) || 0),
    repository_name_length: Math.round(repository_name_length),
    repository_owner: owner,
    repository_name: name
  };

  try {
    const response = await apiClient.post('/predict/stars', payload);
    const latencyMs = Math.round(performance.now() - start);

    return {
      predicted_stars: response.data.predicted_stars,
      repository_name_length,
      latencyMs,
      payload
    };
  } catch (error) {
    throw parseApiError(error);
  }
}
