// rental-platform-frontend/netlify/functions/api.js
const serverless = require("serverless-http");
const app = require("./server");   // now server.js is next door
module.exports.handler = serverless(app);
