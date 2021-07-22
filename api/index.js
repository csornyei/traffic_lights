const { createServer } = require("http");
const app = require("./app");
const { io } = require("./socketApi");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const server = createServer(app);
if (process.env.NODE_ENV === "development") {
    io.attach(server, {
        cors: {
            origin: "http://localhost:3000"
        }
    });
} else {
    io.attach(server);
}

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})