import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

// The .env file lives at the ROOT of the project (one level above backend/).
// When we run `npm run dev` from inside backend/, the process cwd is backend/,
// so "../.env" resolves to <project-root>/.env. The second call is a fallback
// for anyone who keeps a .env inside backend/ instead.
dotenv.config({ path: "../.env" });
dotenv.config();

/**
 * Point Node's DNS resolver at working nameservers, when the machine needs it.
 *
 * A `mongodb+srv://` URL is resolved with dns.resolveSrv(), which uses Node's
 * own DNS client (c-ares) - NOT the Windows resolver that your browser and
 * PowerShell use. On some networks, and whenever Windows "Mobile hotspot" /
 * Internet Connection Sharing is running, Node is told to ask 127.0.0.1, where a
 * stub resolver closes the connection instead of answering. The symptom is a
 * confusing "querySrv ECONNREFUSED" even though the cluster is healthy and DNS
 * works everywhere else on the same machine.
 *
 * Set DNS_SERVERS in .env to override it, for example:
 *   DNS_SERVERS=8.8.8.8,202.88.156.6
 *
 * Leave it unset on normal machines and on Render / Netlify - it changes nothing.
 */
const dnsServers = (process.env.DNS_SERVERS || "")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
    console.log(`DNS resolver set to: ${dnsServers.join(", ")}`);
}

/**
 * Connect to MongoDB, retrying with a backoff.
 *
 * A local MongoDB is ready in a few milliseconds. A cloud database (MongoDB
 * Atlas) is not: it needs a DNS lookup for the SRV record, a TLS handshake and
 * a replica-set discovery round trip - and the cluster can be briefly
 * unreachable while it fails over. So we retry a few times before giving up.
 *
 * @param {number} maxRetries how many attempts to make before giving up
 * @param {object} options
 * @param {boolean} options.exitOnFailure call process.exit(1) when the retries
 *   run out. A normal server wants that - it must not pretend to be healthy.
 *   A serverless function does not: it must be able to answer the request with
 *   a 503 instead of being killed mid-flight.
 */
export const connectDB = async (
    maxRetries = 5,
    { exitOnFailure = true } = {}
) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                // Fail fast instead of hanging, so the retry loop can take over.
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000,
                socketTimeoutMS: 45000,
            });
            console.log("Connected to the server");
            return;
        } catch (error) {
            console.error(
                `Database connection attempt ${attempt}/${maxRetries} failed: ${error.message}`
            );

            if (attempt === maxRetries) {
                console.error("Could not reach the database. Giving up.");
                if (exitOnFailure) {
                    process.exit(1);
                }
                throw new Error("Could not reach the database.");
            }

            // Linear backoff: wait 2s, then 4s, then 6s...
            const waitMs = attempt * 2000;
            console.log(`Retrying in ${waitMs / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, waitMs));
        }
    }
};
