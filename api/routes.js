const { Router } = require("express");
const sensorData = require("./sensors.json");
const logins = require("./logins.json");

const router = Router();

router.get("/", (_, res) => {
    res.send(sensorData);
});

router.get("/:id", (req, res) => {
    const { start, end } = req.query;
    const { id } = req.params;

    let filteredLogins = logins.filter(login => `${login.sensor_id}` === id);

    if (filteredLogins.length === 0) {
        res.status(404).send({
            error: "Not found"
        });
        return;
    }

    if (start) {
        filteredLogins = filteredLogins.filter(login => new Date(login.created_at) > new Date(parseInt(start)));
    }

    if (end) {
        filteredLogins = filteredLogins.filter(login => new Date(login.created_at) < new Date(parseInt(end)));
    }

    res.send(filteredLogins);
});

router.put("/:id", (req, res) => {
    const { latitude, longitude } = req.body;
    const { id } = req.params;

    if (!latitude || !longitude) {
        res.status(400).send({
            error: "Both latitude and longitude is required!"
        });
        return;
    }

    const sensorIdx = sensorData.findIndex((sensor) => id === `${sensor.id}`);
    if (sensorIdx === -1) {
        res.status(404).send({
            error: "Not found"
        });
        return;
    }
    const sensor = { ...sensorData[sensorIdx], latitude, longitude };
    sensorData[sensorIdx] = sensor;

    res.send(sensor);
})

module.exports = router;