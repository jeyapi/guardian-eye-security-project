// API Configuration
export const API_URL = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL || 'https://guardian-eye-backend.onrender.com/api'
    : 'http://localhost:3001/api';

export const API_ENDPOINTS = {
    health: '/health',
    ingest: '/ingest',
    stats: '/stats',
    logs: '/logs',
    buildProfiles: '/build-profiles',
    detectAnomalies: '/detect-anomalies',
    profiles: '/profiles',
    clear: '/clear',
} as const;
