// backend/start.js
const startServer = require('./server');

// start the server (useful for environments that require a separate entry point)
startServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
