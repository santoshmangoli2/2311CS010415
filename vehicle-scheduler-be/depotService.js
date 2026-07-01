const axios = require("axios");

const TOKEN = process.env.ACCESS_TOKEN;

async function getDepots() {
    try {

        const response = await axios.get(
            "http://4.224.186.213/evaluation-service/depots",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.depots;

    } catch (err) {

        console.error(err.response?.data || err.message);

    }
}

module.exports = getDepots;