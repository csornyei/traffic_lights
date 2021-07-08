# Answers

## Database

I am familiar with relational databases (PostgreSQL, MySQL) and MongoDB as NoSQL database. I considered these two solutions. I think both should be suitable for these requirements.

For the MongoDB solution I would use one collection which contains both the sensor's data and the logins.

This would be the schema I would use:
```
{
    _id: ObjectID,
    sensor_id: Number,
    location: {
        type: "Point",
        coordinates: [longitude, latitude]
    },
    logins: [
        {
            created_at: Timestamp,
            type: "status" | "error",
            content: String[]
        }
    ]
}
```
The main benefit of this solution is that the schema is easily extendedable. Because of the logins are stored inside the sensor object there is no need to write joins with other tables. The maximum size of one document is 16 megabytes. A login object as JSON file take about 90 bytes. This means only 187000 (16 * 1024 * 1024 / 90) login can be inserted to a sensor. If there is one login per minutes it means the document would be full in 130 days or in 2 days if there is a login every second.

Storing the logins in a different collection would solve this problem. However, this would lead to a referenced relationship which results in using multiple queries.

As the system should be able to handle this amount of data I thought multiple tables are needed to store the information. I choose relational database for solution as it's purpose is to map the connection between tables.

I tried to have the simplest solution so my database looks like this:

![Database schema](./sensors-database.png)

There is a one-to-many relationship between the sensor and the status table. The status_type enum contains two values: "status" and "error". I also added an SQL file which contains simple queries for the given requirements.
