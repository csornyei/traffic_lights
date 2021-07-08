function bytesToNumber(accumulator, current, index) {
    return accumulator + current * Math.pow(256, index);
}

function interpreter(buffer) {
    const message = {};
    if (!Buffer.isBuffer(buffer)) {
        throw new Error("Expected a buffer!")
    }

    if (Buffer.byteLength(buffer) !== 11) {
        throw new Error("Buffer must be 11 bytes length!");
    }

    switch (buffer[0]) {
        case 1:
            message["type"] = "state"
            break;
        case 2:
            message["type"] = "error";
            break;
        default:
            throw new Error("The buffer must start with 0x01 or 0x02");
    }

    if (buffer[10] !== 255) {
        throw new Error("The last byte must be 0xFF");
    }

    const id = buffer.slice(1, 5).toJSON().data.reduce(bytesToNumber);
    if (id > 60000) {
        throw new Error("The ID can't be larger than 60000")
    }
    message["id"] = id;

    const timestamp = buffer.slice(5, 9).toJSON().data.reduce(bytesToNumber);
    message["timestamp"] = timestamp;

    if (message.type === "state") {
        switch (buffer[9]) {
            case 1:
                message["content"] = "red";
                break;
            case 2:
                message["content"] = "yellow";
                break;
            case 3:
                message["content"] = "green";
                break;
            case 255:
                message["content"] = "unknown state";
                break;
            default:
                throw new Error("Invalid content!");
        };
    } else {
        const errors = [];
        let contentByte = buffer[9];
        // setting the 0b1000101 is 69 where all three error bit is on
        // anything bigger than this is invalid
        if (contentByte > 69 || contentByte === 0) {
            throw new Error("Invalid content!");
        }
        if (contentByte >= 64) {
            errors.push("Bandwidth Error");
            contentByte -= 64;
        }
        if (contentByte >= 4) {
            errors.push("Traffic Light Error");
            contentByte -= 4;
        }
        if (contentByte >= 1) {
            errors.push("Internal Sensor Error");
            contentByte -= 1;
        }
        if (contentByte > 0) {
            throw new Error("Invalid content!");
        }
        message["content"] = errors;
    }

    return message;
}

module.exports = interpreter;