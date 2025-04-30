const serverless = require("serverless-http");
// point this at the file that *exports* your Express app, not the one that calls app.listen()
const app = require("../../server"); 

// serverless-http will take all your routes (/admin, /api, etc.) 
// and turn them into a single Netlify Function.
module.exports.handler = serverless(app);
