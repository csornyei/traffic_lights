const io = require("socket.io")();
const { getSensorIDs } = require("./sensorModel");

const ROOMS = {
    SENSORS: "sensors",
    CLIENTS: "clients"
};

const EVENTS = {
    SENSOR_IDS: "sensors",
    REQ_SENSOR_STATUS: "requestSensorStatus",
    RES_SENSOR_STATUS: "responseSensorStatus",
    UPD_SENSOR_STATUS: "sensorStatusUpdate"
}

io.on("connection", (socket) => {
    if (socket.handshake.auth.token === process.env.SENSOR_CLIENT_SECRET) {
        console.log("New sensor connected");
        socket.join(ROOMS.SENSORS);

        getSensorIDs().then(({ rows }) => {
            socket.emit(EVENTS.SENSOR_IDS, rows);
        }).catch(err => {
            console.error("Can't get sensor ids", error);
        });
    } else {
        socket.join(ROOMS.CLIENTS);
        console.log("New client connected!");
    }

    socket.on("disconnect", () => {
        console.log("Client disconnected!");
    });

    socket.on(EVENTS.RES_SENSOR_STATUS, (res) => {
        io.to(ROOMS.CLIENTS).emit(EVENTS.UPD_SENSOR_STATUS, res);
    })
});

function getSensorStatus(sensorId) {
    console.log(sensorId);
    io.to(ROOMS.SENSORS).emit(EVENTS.REQ_SENSOR_STATUS, sensorId);
}

module.exports = {
    io,
    getSensorStatus
}