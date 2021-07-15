const io = require("socket.io-client");
require("dotenv").config();

const EVENTS = {
    CONNECT: "connection",
    DISCONNECT: "disconnect",
    SENSOR_IDS: "sensors",
    REQ_SENSOR_STATUS: "requestSensorStatus",
    RES_SENSOR_STATUS: "responseSensorStatus",
    UPD_SENSOR_STATUS: "sensorStatusUpdate",
    NEW_LOGIN: "createNewLogin",
    REMOVE_OLD_LOGINS: "removeOldLogins"
}

const sensorIds = [];

const REMOVE_OLD_LOGIN_TIMEOUT = 1000 * 60 * 60 * 24 * 5;
const CREATE_NEW_LOGIN_TIMEOUT = 1000 * 60;

function removeOldLogins() {
    const before = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5);

    const year = before.getFullYear();
    const month = before.getMonth() < 9 ? `0${before.getMonth() + 1}` : `${before.getMonth()}`;
    const day = before.getDate() < 10 ? `0${before.getDate()}` : `${before.getDate()}`;
    const hour = before.getHours() < 10 ? `0${before.getHours()}` : `${before.getHours()}`;
    const minutes = before.getMinutes() < 10 ? `0${before.getMinutes()}` : `${before.getMinutes()}`;
    const seconds = before.getSeconds() < 10 ? `0${before.getSeconds()}` : `${before.getSeconds()}`;

    socket.emit(EVENTS.REMOVE_OLD_LOGINS, `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);
    console.log("Removing old logins");
    setTimeout(removeOldLogins, REMOVE_OLD_LOGIN_TIMEOUT);
}

function createNewLogins() {
    const amount = Math.round(Math.random() * 15 + 1);
    const logins = [];
    const tempIDs = [...sensorIds];
    for (let index = 0; index < amount; index++) {
        const idIdx = Math.floor(Math.random() * tempIDs.length);
        const id = tempIDs[idIdx];
        tempIDs.splice(idIdx, 1);
        const type = Math.random() > 0.3 ? "status" : "error";
        const contentRand = Math.random();
        let content = "";
        if (type === "status") {
            content = "unknown state";
            if (contentRand > 0.75) {
                content = "red";
            } else if (contentRand > 0.5) {
                content = "yellow";
            } else if (contentRand > 0.25) {
                content = "green"
            }
        } else {
            if (contentRand > 0.86) {
                content = "Bandwidth Error";
            } else if (contentRand > 0.72) {
                content = "Traffic Light Error";
            } else if (contentRand > 0.58) {
                content = "Internal Sensor Error";
            } else if (contentRand > 0.44) {
                content = "Bandwidth Error,Traffic Light Error";
            } else if (contentRand > 0.3) {
                content = "Bandwidth Error,Internal Sensor Error";
            } else if (contentRand > 0.15) {
                content = "Traffic Light Error,Internal Sensor Error";
            } else {
                content = "Bandwidth Error,Traffic Light Error,Internal Sensor Error"
            }
        }
        logins.push({ id, type, content });
    }
    console.log(`Creating ${logins.length} new logins`);
    socket.emit(EVENTS.NEW_LOGIN, logins);

    setTimeout(createNewLogins, CREATE_NEW_LOGIN_TIMEOUT * (Math.random() * 5 + 1))
}

const socket = io.connect("https://traffic-lights-csornyei.herokuapp.com/", {
    reconnect: true,
    auth: {
        token: process.env.SENSOR_CLIENT_SECRET
    }
});

socket.on(EVENTS.SENSOR_IDS, (ids) => {
    console.log("Sensor IDs arrived!");
    ids.forEach(({ id }) => {
        sensorIds.push(id);
    });
});

socket.on(EVENTS.REQ_SENSOR_STATUS, (id) => {
    console.log(EVENTS.REQ_SENSOR_STATUS, id);
    const rand = Math.random();
    let status = "unknown state";
    if (rand > 0.6) {
        status = "red";
    } else if (rand > 0.5) {
        status = "yellow";
    } else if (rand > 0.1) {
        status = "green"
    }
    socket.emit(EVENTS.RES_SENSOR_STATUS,
        {
            id,
            status
        });
});

setTimeout(removeOldLogins, REMOVE_OLD_LOGIN_TIMEOUT);
setTimeout(createNewLogins, CREATE_NEW_LOGIN_TIMEOUT * (Math.random() * 5 + 1));