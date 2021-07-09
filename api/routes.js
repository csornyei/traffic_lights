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

    if (start) {
        filteredLogins = filteredLogins.filter(login => new Date(login.created_at) > new Date(parseInt(start)));
    }

    if (end) {
        filteredLogins = filteredLogins.filter(login => new Date(login.created_at) < new Date(parseInt(end)));
    }


    res.send(filteredLogins);
})

module.exports = router;