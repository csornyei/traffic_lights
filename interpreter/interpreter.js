function bytesToNumber(accumulator, current, index) {
    return accumulator + current * Math.pow(256, index);
}

function checkBufferLength(buffer, requiredLength) {
    if (Buffer.byteLength(buffer) !== requiredLength) {
        throw new Error(`Buffer must be ${requiredLength} bytes length!`);
    }
}

function validateBuffer(buffer, bufferLength) {
    if (!Buffer.isBuffer(buffer)) {
        throw new Error("Expected a buffer!")
    }

    checkBufferLength(buffer, bufferLength);

    if (buffer[bufferLength - 1] !== 255) {
        throw new Error("The last byte must be 0xFF");
    }
}

function getMessageType(byte) {
    switch (byte) {
        case 1:
            return "state"
        case 2:
            return "error";
        default:
            throw new Error("The buffer must start with 0x01 or 0x02");
    }
}

function getIdFromBuffer(buffer) {
    const id = buffer.slice(1, 5).toJSON().data.reduce(bytesToNumber);
    if (id > 60000) {
        throw new Error("The ID can't be larger than 60000")
    }
    return id;
}

function getTimestampFromBuffer(buffer) {
    return buffer.slice(5, 9).toJSON().data.reduce(bytesToNumber);
}

function padDateNumbers(number) {
    return number < 10 ? `0${number}` : `${number}`;
}

function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = padDateNumbers(date.getMonth() + 1);
    const day = padDateNumbers(date.getDate());
    const hour = padDateNumbers(date.getHours());
    const minutes = padDateNumbers(date.getMinutes());
    const seconds = padDateNumbers(date.getSeconds());
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

function getStateContent(byte) {
    switch (byte) {
        case 1:
            return "red";
        case 2:
            return "yellow";
        case 3:
            return "green";
        case 255:
            return "unknown state";
        default:
            throw new Error("Invalid content!");
    };
}

function getErrorContent(byte) {
    const errors = [];
    // setting the 0b1000101 is 69 where all three error bit is on
    // anything bigger than this is invalid
    if (byte > 69 || byte === 0) {
        throw new Error("Invalid content!");
    }
    if (byte >= 64) {
        errors.push("Bandwidth Error");
        byte -= 64;
    }
    if (byte >= 4) {
        errors.push("Traffic Light Error");
        byte -= 4;
    }
    if (byte >= 1) {
        errors.push("Internal Sensor Error");
        byte -= 1;
    }
    if (byte > 0) {
        throw new Error("Invalid content!");
    }
    return errors;
}

function getContentFromBuffer(buffer) {
    const type = getMessageType(buffer[0]);
    if (type === "state") {
        return getStateContent(buffer[9]);
    }
    if (type === "error") {
        return getErrorContent(buffer[9]);
    }
}

function interpreter(buffer) {
    validateBuffer(buffer, 11);

    return {
        type: getMessageType(buffer[0]),
        id: getIdFromBuffer(buffer),
        timestamp: formatTimestampToDate(getTimestampFromBuffer(buffer)),
        content: getContentFromBuffer(buffer)
    };
}

module.exports = interpreter;