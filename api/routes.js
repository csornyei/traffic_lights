const { Router } = require("express");
const {
    getAllSensor,
    getSensorLogins,
    updateSensorPosition
} = require("./sensorModel");
const { getSensorStatus } = require("./socketApi");

const router = Router();

router.get("/", (_, res) => {
    getAllSensor()
        .then(({ rows }) => {
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({
                    error: "There are no sensors"
                })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                error: "Internal server error"
            })
        });
});

router.get("/:id/status", (req, res) => {
    getSensorStatus(req.params.id);
    res.send("Hello");
})

router.get("/:id", (req, res) => {
    const { start, end } = req.query;
    const { id } = req.params;

    getSensorLogins(id, start, end)
        .then(({ rows }) => {
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({
                    error: "No results"
                });
            }
        })
        .catch(({ status, msg, error }) => {
            console.error(error);
            res.status(status).send(msg);
        })
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

    updateSensorPosition(id, latitude, longitude)
        .then(({ rowCount }) => {
            if (rowCount > 0) {
                res.send("Update was successful!");
            } else {
                res.send("No rows were updated!");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                error: "Internal server error"
            });
        });
})

module.exports = router;