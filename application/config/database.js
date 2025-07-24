var mysql = require('mysql2');


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectTimeout: 15000,
    idleTimeout: 1000*60*10,
    connectionLimit: 20
});

module.exports = pool.promise();