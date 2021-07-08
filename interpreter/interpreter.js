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
}

module.exports = interpreter;