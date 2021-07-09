const express = require("express");
const { json } = require("express");

const router = require("./routes");

const app = express();

app.use(json());
app.use("/api", router);
app.all("*", (_, res) => {
    res.status(404).send({
        error: "Page not found"
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})