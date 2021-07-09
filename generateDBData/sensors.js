const fs = require("fs");
const faker = require("faker");

function generateData(n) {
    const sensors = [];
    for (let index = 0; index < n; index++) {
        const lat = faker.address.latitude(52.4281, 52.2836, 6);
        const long = faker.address.longitude(4.994, 4.7829, 6);
        sensors.push({
            id: index,
            latitude: lat,
            longitude: long
        });
    }

    return sensors;
}

function generateSQL(n) {
    const sensors = generateData(n);

    fs.writeFileSync("sensors.sql", sensors.map(({ id, latitude, longitude }) => {
        return `INSERT INTO sensor (id, latitude, longitude) VALUES (${id}, ${latitude}, ${longitude});`
    }).join("\n"));
}

module.exports = {
    generateData,
    generateSQL
};