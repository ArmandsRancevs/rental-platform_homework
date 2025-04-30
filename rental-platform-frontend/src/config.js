// src/config.js
// If you’re running locally, hit your Express server.
// Otherwise, on Netlify, proxy through the Functions endpoint.
export const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '/.netlify/functions/api';
