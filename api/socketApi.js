const io = require("socket.io")();
const { getSensorIDs, createNewLogin, removeOldLogins } = require("./sensorModel");

const ROOMS = {
    SENSORS: "sensors",
    CLIENTS: "clients"
};

const EVENTS = {
    CONNECT: "connection",
    DISCONNECT: "disconnect",
    SENSOR_IDS: "sensors",
    CLIENT_SENSOR_STATUS: "clientSensorStatus",
    REQ_SENSOR_STATUS: "requestSensorStatus",
    RES_SENSOR_STATUS: "responseSensorStatus",
    UPD_SENSOR_STATUS: "sensorStatusUpdate",
    NEW_LOGIN: "createNewLogin",
    REMOVE_OLD_LOGINS: "removeOldLogins"
}

io.on(EVENTS.CONNECT, (socket) => {
    if (socket.handshake.auth.token === process.env.SENSOR_CLIENT_SECRET) {
        console.log("New sensor connected");
        socket.join(ROOMS.SENSORS);

        getSensorIDs().then(({ rows }) => {
            socket.emit(EVENTS.SENSOR_IDS, rows);
        }).catch(err => {
            console.error("Can't get sensor ids", err);
        });

        socket.on(EVENTS.NEW_LOGIN, (data) => {
            createNewLogin(data);
        });

        socket.on(EVENTS.REMOVE_OLD_LOGINS, (before) => {
            removeOldLogins(before);
        });

        socket.on(EVENTS.RES_SENSOR_STATUS, (res) => {
            createNewLogin([{
                id: res.id,
                type: "status",
                content: res.status,
            }]);
            io.to(ROOMS.CLIENTS).emit(EVENTS.UPD_SENSOR_STATUS, res);
        });
    } else {
        socket.join(ROOMS.CLIENTS);
        console.log("New client connected!");

        socket.on(EVENTS.CLIENT_SENSOR_STATUS, (id) => {
            io.to(ROOMS.SENSORS).emit(EVENTS.REQ_SENSOR_STATUS, sensorId);
        })
    }

    socket.on(EVENTS.DISCONNECT, () => {
        console.log("Client disconnected!");
    });
});

module.exports = {
    io
}