const { query } = require("./queries");

const getAllSensor = () => {
    return new Promise((resolve, reject) => {
        query(
            "SELECT * FROM sensor JOIN (SELECT DISTINCT ON(sensor_id) * FROM login ORDER BY sensor_id, created_at DESC) as lgn ON lgn.sensor_id = sensor.id;",
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
    })
}

const getSensorIDs = () => {
    return new Promise((resolve, reject) => {
        query("SELECT id FROM sensor", (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        })
    })
}

const getSensorLogins = (sensorId, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        if (!sensorId) {
            reject({
                status: 400,
                msg: "Sensor ID must be provided!"
            });
        }
        let queryString = 'SELECT * FROM login WHERE sensor_id = $1';
        const parameters = [sensorId];
        if (startDate) {
            parameters.push(startDate);
            queryString += ` AND created_at > $${parameters.length}`;
        }
        if (endDate) {
            parameters.push(endDate);
            queryString += ` AND created_at < $${parameters.length}`;
        }

        query(queryString, parameters, (error, result) => {
            if (error) {
                reject({
                    status: 500,
                    msg: "Internal server error",
                    error,
                });
            }
            resolve(result);
        })
    })
}

const updateSensorPosition = (sensorId, latitude, longitude) => {
    return new Promise((resolve, reject) => {
        query("UPDATE sensor SET latitude=$2, longitude=$3 WHERE id = $1",
            [sensorId, latitude, longitude], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
    })
}

const createNewLogin = (logins) => {
    let queryString = "INSERT INTO login(sensor_id, type, content) VALUES";
    const queryParams = [];
    let paramCounter = 1;
    logins.forEach(({ id, type, content }, idx, arr) => {
        if (idx === arr.length - 1) {
            queryString += ` ($${paramCounter}, $${paramCounter + 1}, $${paramCounter + 2})`;
        } else {
            queryString += ` ($${paramCounter}, $${paramCounter + 1}, $${paramCounter + 2}),`;
        }
        paramCounter += 3;
        queryParams.push(id);
        queryParams.push(type);
        queryParams.push(content);
    });
    return new Promise((resolve, reject) => {
        query(
            queryString,
            queryParams,
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            })
    })
}

const removeOldLogins = (before) => {
    return new Promise((resolve, reject) => {
        query("DELETE FROM login WHERE created_at < $1", [before], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        })
    });
}

module.exports = {
    getSensorIDs,
    getAllSensor,
    createNewLogin,
    removeOldLogins,
    getSensorLogins,
    updateSensorPosition
}