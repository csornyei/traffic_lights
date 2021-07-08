/*
    You should be able to list the sensors, and their precise location, in order to be able todisplay them on a map.
*/
SELECT * FROM sensor;
/*
    You should be able to list every time the sensor has been logged in.
*/
SELECT
    login.id,
    login.created_at,
    login.sensor_id,
    sensor.id
FROM
    login
RIGHT JOIN sensor
    ON login.sensor_id = sensor.id
WHERE
    sensor.id = 16
ORDER BY
    login.created_at;
/*
    You should be able to have the last state of each sensor, the last error and the last timeit has been logged in.
*/
-- last state and error
SELECT
    login.id,
    login.created_at,
    login.sensor_id,
	login.type,
	login.content
FROM
    login
RIGHT JOIN sensor
    ON login.sensor_id = sensor.id
WHERE
    sensor.id = 16
    AND
    login.created_at IN (SELECT MAX(created_at) FROM login WHERE sensor_id = 16 GROUP BY type)
-- last log in
SELECT
    login.id,
    login.created_at,
    login.sensor_id
FROM
    login
RIGHT JOIN sensor
    ON login.sensor_id = sensor.id
WHERE
    sensor.id = 16
    AND
    login.created_at IN (SELECT MAX(created_at) FROM login WHERE sensor_id = 16);
/*
    You should be able to list all the data (errors & states) of the sensor between two dates.
*/
SELECT
    login.id,
    login.type,
    login.content,
    login.created_at,
    login.sensor_id,
    sensor.id
FROM
    login
RIGHT JOIN sensor
    ON login.sensor_id = sensor.id
WHERE
    sensor.id = 16
    AND
    login.created_at >= '2021-07-07 19:00:00'
    AND
    login.created_at < '2021-07-08 5:00:00'
ORDER BY
    login.created_at;
/*
    You should be able to say if the sensor is currently online
*/
SELECT
    login.id,
    login.created_at
FROM
    login
RIGHT JOIN sensor
    ON login.sensor_id = sensor.id
WHERE
    sensor.id = 16
    AND
    login.created_at > CURRENT_TIMESTAMP - INTERVAL '5 minute'