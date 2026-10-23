import mongoose from "mongoose";
import dotenv from "dotenv";

// The .env file lives at the ROOT of the project (one level above backend/).
// When we run `npm run dev` from inside backend/, the process cwd is backend/,
// so "../.env" resolves to <project-root>/.env. The second call is a fallback
// for anyone who keeps a .env inside backend/ instead.
dotenv.config({ path: "../.env" });
dotenv.config();

export const connectDB = async () => {
    try {
        // Never hardcode the connection string: read it from the environment.
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to the server");
    } catch (error) {
        console.error("Error: ", error.message);
        process.exit(1);
    }
};
