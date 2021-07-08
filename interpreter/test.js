const interpreter = require("./interpreter");

function numberToBytes(n) {
    const bytes = [];
    while (n > 0) {
        bytes.push(n % 256);
        n = Math.floor(n / 256);
    }
    return bytes;
}

describe('Buffer Interpreter', () => {
    it('should throw error if parameter is not a buffer', () => {
        expect(() => interpreter("Hello")).toThrow("Expected a buffer!");
    });

    it('should throw error if buffer is not 11 bytes long', () => {
        expect(() => interpreter(Buffer.alloc(1))).toThrow("Buffer must be 11 bytes length!");
        expect(() => interpreter(Buffer.alloc(32))).toThrow("Buffer must be 11 bytes length!");
    });

    it('should throw an error if the first byte is not 1 or 2', () => {
        const bytes = Array(11);
        expect(() => interpreter(Buffer.from(bytes))).toThrow("The buffer must start with 0x01 or 0x02");
    });

    it('should throw an error if the last byte is not 255', () => {
        const bytes = Array(11);
        bytes[0] = 1;
        expect(() => interpreter(Buffer.from(bytes))).toThrow("The last byte must be 0xFF");
    });

    it('should throw an error if the ID is larger than 60000', () => {
        const bytes = Array(11);
        bytes[0] = 1;
        bytes[10] = 255;
        // two bytes can store numbers up to 65535 numbers
        // so setting the third to 1 will make sure to exceed this
        bytes[3] = 1;
        expect(() => interpreter(Buffer.from(bytes))).toThrow("The ID can't be larger than 60000");
    });

    it('should throw an error if it\'s state and the content is wrong', () => {
        const bytes = [
            1,
            1, 1, 0, 0,
            ...numberToBytes(Math.floor(new Date(2020, 0, 1, 12, 35, 3) / 1000)),
            16,
            255
        ];
        expect(() => interpreter(Buffer.from(bytes))).toThrow("Invalid content!");
    });

    it('should throw an error if it\'s error and the content is wrong', () => {
        const bytes = [
            2,
            1, 1, 0, 0,
            ...numberToBytes(Math.floor(new Date(2020, 0, 1, 12, 35, 3) / 1000)),
            70,
            255
        ];
        expect(() => interpreter(Buffer.from(bytes))).toThrow("Invalid content!");

        bytes[9] = 0;
        expect(() => interpreter(Buffer.from(bytes))).toThrow("Invalid content!");

        bytes[9] = 16;
        expect(() => interpreter(Buffer.from(bytes))).toThrow("Invalid content!");
    })

    it('should interpret the message correctly', () => {
        const now = Math.floor(new Date(2020, 0, 1, 12, 35, 3) / 1000);
        let bytes = [
            1,
            0, 1, 0, 0,
            ...numberToBytes(now),
            1,
            255
        ];

        expect(interpreter(Buffer.from(bytes))).toStrictEqual({
            type: "state",
            id: 256,
            timestamp: "2020-01-01 12:35:03",
            content: "red",
        });

        bytes = [
            1,
            0, 1, 0, 0,
            ...numberToBytes(now),
            255,
            255
        ];

        expect(interpreter(Buffer.from(bytes))).toStrictEqual({
            type: "state",
            id: 256,
            timestamp: "2020-01-01 12:35:03",
            content: "unknown state",
        });

        bytes = [
            2,
            0, 1, 0, 0,
            ...numberToBytes(now),
            69,
            255
        ];

        expect(interpreter(Buffer.from(bytes))).toStrictEqual({
            type: "error",
            id: 256,
            timestamp: "2020-01-01 12:35:03",
            content: [
                "Bandwidth Error",
                "Traffic Light Error",
                "Internal Sensor Error"
            ],
        });
    })
})
