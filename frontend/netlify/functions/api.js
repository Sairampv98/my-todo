// The Express API, running as a Netlify Function.
//
// This is the "everything on Netlify" strategy (Strategy 1 in
// docs/DEPLOYMENT-STRATEGIES.md).
//
// serverless-http translates the function's event object into an ordinary
// HTTP request, hands it to the Express app, and translates the response
// back. Inside the request it behaves exactly like Express.
//
// The app is IMPORTED, not started: server.js only calls app.listen() when it
// is the entry point, so importing it here gives us the Express app without
// opening a port. The database connection is made lazily on the first request
// and reused while the instance stays warm.
//
// The import path climbs out of frontend/netlify/functions/ to the backend at
// the repository root - which is why the function lives under the frontend
// base directory: Netlify resolves the functions directory relative to the
// base directory, and with base = "frontend" that is frontend/netlify/functions.

import serverless from "serverless-http";
import { app } from "../../../backend/src/server.js";

export const handler = serverless(app);
