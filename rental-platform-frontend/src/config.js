// src/config.js

// When running locally, talk to your standalone Express server.
// Once deployed on Netlify, leave the base blank so that
// `/api/*` and `/admin/*` hit your Netlify Function via the redirects in netlify.toml.
export const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '';
