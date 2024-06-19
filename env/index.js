// env.js

const dotenv = require("dotenv");
const fs = require("fs");

module.exports = function loadEnv() {
    const env = process.env.NODE_ENV || "development";
    const envPath = `.env.${env}`;

    // Check if the environment file exists
    if (!fs.existsSync(envPath)) {
        throw new Error(`Environment file ${envPath} does not exist`);
    }

    // Load environment variables from the file
    const result = dotenv.config({ path: envPath });

    if (result.error) {
        throw result.error;
    }

    // Check if all required variables exist
    const requiredVariables = ["SERVER_PORT", "DB_URL"];
    const missingVariables = requiredVariables.filter(
        (key) => !(key in result.parsed),
    );

    if (missingVariables.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVariables.join(", ")}`,
        );
    }

    return result.parsed;
};