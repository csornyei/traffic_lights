const { query } = require("./queries");

const getAllSensor = () => {
    return new Promise((resolve, reject) => {
        query("SELECT * FROM sensor", (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
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

        console.log(queryString);
        console.log(parameters);

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

module.exports = {
    getAllSensor,
    getSensorLogins,
    updateSensorPosition
}