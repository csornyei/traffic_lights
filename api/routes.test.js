const request = require("supertest");
const app = require("./app");
const sensorData = require("./sensors.json");
const logins = require("./logins.json");

/* describe('GET /api/', () => {
    it("returns the sensors", async () => {
        const { body } = await request(app)
            .get("/api/")
            .send()
            .expect(200);

        expect(body.length).toBe(sensorData.length);
        expect(body).toStrictEqual(sensorData);
    });
});

describe('GET /api/:id', () => {
    it("returns 404 on non existant id", async () => {
        await request(app)
            .get("/api/404")
            .send()
            .expect(404);
    });

    it("returns all login from a sensor", async () => {
        const id = 0

        const filteredLogins = logins.filter(({ sensor_id }) => sensor_id === id);

        const { body } = await request(app)
            .get(`/api/${id}`)
            .send()
            .expect(200);

        expect(body.length).toBe(filteredLogins.length);
        expect(body).toStrictEqual(filteredLogins);
    });

    it("returns logins after a date", async () => {
        const id = 0

        let filteredLogins = logins.filter(({ sensor_id }) => sensor_id === id);

        const startDate = new Date(filteredLogins[5].created_at).getTime();

        filteredLogins = filteredLogins.filter(({ created_at }) => new Date(created_at) > new Date(startDate));

        const { body } = await request(app)
            .get(`/api/${id}?start=${startDate}`)
            .send()
            .expect(200);

        expect(body.length).toBe(filteredLogins.length);
        expect(body).toStrictEqual(filteredLogins);
    });

    it("returns logins after a date", async () => {
        const id = 0

        let filteredLogins = logins.filter(({ sensor_id }) => sensor_id === id);

        const startDate = new Date(filteredLogins[5].created_at).getTime();

        filteredLogins = filteredLogins.filter(({ created_at }) => new Date(created_at) > new Date(startDate));

        const endDate = new Date(filteredLogins[5].created_at).getTime() + 500000;

        filteredLogins = filteredLogins.filter(({ created_at }) => new Date(created_at) < new Date(endDate));

        const { body } = await request(app)
            .get(`/api/${id}?start=${startDate}&end=${endDate}`)
            .send()
            .expect(200);

        expect(body.length).toBe(filteredLogins.length);
        expect(body).toStrictEqual(filteredLogins);
    });

    it("returns nothing if end date is larger than start date", async () => {
        const id = 0

        let filteredLogins = logins.filter(({ sensor_id }) => sensor_id === id);

        const startDate = new Date(filteredLogins[5].created_at).getTime() + 500000;
        const endDate = new Date(filteredLogins[5].created_at).getTime();

        const { body } = await request(app)
            .get(`/api/${id}?start=${startDate}&end=${endDate}`)
            .send()
            .expect(200);

        expect(body.length).toBe(0);
        expect(body).toStrictEqual([]);
    })
}) */
