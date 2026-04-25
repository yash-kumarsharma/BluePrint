// Centralized API Configuration
// Vite uses import.meta.env to access environment variables
// Set VITE_API_BASE_URL in your Vercel/Local .env files

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  ANALYSIS: `${API_BASE_URL}/api/analysis`
};
