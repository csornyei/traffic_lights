const express = require("express");
const cors = require("cors");
const { json } = require("express");
const { join } = require("path");

const router = require("./routes");

const app = express();
app.use(cors());
app.use(json());
app.use(express.static("public"));
app.use("/api", router);
app.get("/", (_, res) => {
    res.sendFile(join(__dirname, "pages", "index.html"));
})
app.all("*", (_, res) => {
    res.status(404).send({
        error: "Not found"
    });
});

module.exports = app;