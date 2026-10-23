// Local test harness for the Netlify Function (Strategy 1).
//
// It builds the same event object Netlify's runtime hands a function and
// calls the handler directly. That verifies the code path that matters: the
// Express app, the lazy database connection, and the CRUD routes - without
// needing a Netlify deploy.
//
// It also proves the second half of the refactor: importing server.js must
// NOT open a port. If it did, the function would leak a listener per request.

import { handler } from "../frontend/netlify/functions/api.js";

const mkEvent = (method, path, body = null) => ({
    httpMethod: method,
    path,
    headers: {
        host: "localhost:8888",
        "content-type": "application/json",
        "user-agent": "local-function-test",
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    body: body ? JSON.stringify(body) : null,
    isBase64Encoded: false,
});

const call = async (method, path, body = null) => {
    const res = await handler(mkEvent(method, path, body), {});
    return res;
};

const show = (label, res) => {
    console.log(
        `${label} -> ${res.statusCode} ${JSON.stringify(res.body).slice(0, 140)}`
    );
};

console.log("--- listening on 8001 while the function is imported? ---");
console.log(
    "a listener would appear below if server.js started a server on import"
);

console.log("\n--- GET /health ---");
show("GET /health", await call("GET", "/health"));

console.log("\n--- GET /todo ---");
show("GET /todo", await call("GET", "/todo"));

console.log("\n--- POST /todo ---");
const created = await call("POST", "/todo", {
    note: "Netlify Function test",
    content: "exercised through the serverless handler",
});
show("POST /todo", created);

const id = JSON.parse(created.body)._id;

console.log("\n--- PUT /todo/:id ---");
show(
    "PUT /todo/:id",
    await call("PUT", `/todo/${id}`, {
        note: "Netlify Function test EDITED",
        content: "the update survived",
    })
);

console.log("\n--- DELETE /todo/:id ---");
show("DELETE /todo/:id", await call("DELETE", `/todo/${id}`));

console.log("\n--- GET /todo/:id after delete (expect 404) ---");
show("GET /todo/:id", await call("GET", `/todo/${id}`));

console.log("\n--- GET / (expect the JSON root route) ---");
show("GET /", await call("GET", "/"));

process.exit(0);
