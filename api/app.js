const express = require("express");
const cors = require("cors");
const { json } = require("express");

const router = require("./routes");

const app = express();
app.use(cors());
app.use(json());
app.use("/api", router);
app.all("*", (_, res) => {
    res.status(404).send({
        error: "Not found"
    });
});

module.exports = app;