const fs = require("fs");
const faker = require("faker");

function generateData(n, sensorIdMax) {
    const logins = [];
    for (let index = 0; index < n; index++) {
        const sensor_id = Math.floor(Math.random() * sensorIdMax + 1);
        const type = Math.random() < 0.8 ? "status" : "error";
        let content;
        if (type === "status") {
            const p = Math.random();
            if (p < 0.25) {
                content = "red";
            } else if (p < 0.5) {
                content = "yellow";
            } else if (p < 0.75) {
                content = "green";
            } else {
                content = "unknown state";
            }
        } else {
            const errors = [];
            if (Math.random() < 0.5) {
                errors.push("Bandwidth Error");
            }
            if (Math.random() < 0.5) {
                errors.push("Traffic Light Error");
            }
            if (Math.random() < 0.5) {
                errors.push("Internal Sensor Error");
            }
            if (errors.length === 0) {
                errors.push("Bandwidth Error");
            }
            content = errors.join(",");
        }
        logins.push({
            sensor_id,
            type,
            content,
            created_at: faker.date.recent()
        });
    }
    return logins;
}

function generateSQL(n, sensorIdMax) {
    const logins = generateData(n, sensorIdMax);
    fs.writeFileSync("logins.sql", logins.map(({ sensor_id, type, content, created_at }) => {
        const date = new Date(created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
        const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;

        const formattedDate = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
        return `INSERT INTO login (sensor_id, type, content, created_at) VALUES (${sensor_id}, '${type}', '${content}', '${formattedDate}');`
    }).join("\n"));
}

module.exports = {
    generateData,
    generateSQL
};