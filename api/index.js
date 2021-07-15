const { createServer } = require("http");
const app = require("./app");
const { io } = require("./socketApi");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const server = createServer(app);
io.attach(server);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})