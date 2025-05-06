// frontend/src/config.js
const isLocalhost = window.location.hostname === 'localhost';

export const API_BASE = isLocalhost
  ? 'http://localhost:5000/api'
  : '/api';

export const ADMIN_BASE = isLocalhost
  ? 'http://localhost:5000/admin'
  : '/admin';
