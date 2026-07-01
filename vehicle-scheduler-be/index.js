require("dotenv").config();

const axios = require("axios");
const scheduleVehicles = require("./scheduler");

const TOKEN = process.env.ACCESS_TOKEN;

async function main() {
    try {
        // Fetch depots
        const depotResponse = await axios.get(
            "http://4.224.186.213/evaluation-service/depots",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // Fetch vehicles
        const vehicleResponse = await axios.get(
            "http://4.224.186.213/evaluation-service/vehicles",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const depots = depotResponse.data.depots;
        const vehicles = vehicleResponse.data.vehicles;

        for (const depot of depots) {
            console.log(`\nDepot ${depot.ID}`);
            console.log(`Mechanic Hours: ${depot.MechanicHours}`);

            const result = scheduleVehicles(
                vehicles,
                depot.MechanicHours
            );

            console.log("Maximum Impact:", result.MaximumImpact);
            console.log("Selected Tasks:");

            result.SelectedTasks.forEach(task => {
                console.log(
                    `${task.TaskID} | Duration: ${task.Duration} | Impact: ${task.Impact}`
                );
            });
        }

    } catch (err) {
        console.error(err.response?.data || err.message);
    }
}

main();