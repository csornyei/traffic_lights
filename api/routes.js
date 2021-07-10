const { Router } = require("express");
const sensorData = require("./sensors.json");
const logins = require("./logins.json").map(login => {
    /*  I created a mockup JSON,
        but as I later saw the client side require
        to show data for the last 2 weeks
        So I decided to make sure there is data
        for this time period
    */
    const THREE_WEEKS_IN_MS = 3 * 7 * 24 * 60 * 60 * 1000;
    const dateThreeWeeksAgo = Date.now() - THREE_WEEKS_IN_MS;
    login.created_at = Math.floor(
        Math.random() * (
            Date.now() - (dateThreeWeeksAgo)
        ) + dateThreeWeeksAgo);
    return login;
});

const router = Router();

router.get("/", (_, res) => {
    const sensorDataWithLastStatus = sensorData.map(data => {
        const sensorLogins = logins.filter(login => login.sensor_id === data.id && login.type === "status");
        let latest = sensorLogins[0];
        sensorLogins.forEach(login => {
            if (new Date(login.created_at) > new Date(latest.created_at)) {
                latest = login;
            }
        });
        return {
            ...data,
            status: latest
        };
    })
    res.send(sensorDataWithLastStatus);
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