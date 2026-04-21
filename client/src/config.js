// Centralized API Configuration
// Switch between local and production URLs here

const IS_PRODUCTION = false; // Set to true when deploying

export const API_BASE_URL = IS_PRODUCTION 
  ? 'https://blueprint-no08.onrender.com' 
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  ANALYSIS: `${API_BASE_URL}/api/analysis`
};
