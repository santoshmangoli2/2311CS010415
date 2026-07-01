require("dotenv").config();
const axios = require("axios");

const LOG_API = process.env.LOG_API;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

/**
 * Send logs to AffordMed Log API
 * @param {string} stack - backend
 * @param {string} level - debug | info | warn | error | fatal
 * @param {string} packageName - controller | service | route | db | ...
 * @param {string} message - Log message
 */
async function Log(stack, level, packageName, message) {
    try {
        const response = await axios.post(
            LOG_API,
            {
                stack,
                level,
                package: packageName,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Log Sent Successfully");
        return response.data;

    } catch (error) {
        console.error(
            "Logging Failed:",
            error.response?.data || error.message
        );
    }
}

module.exports = Log;