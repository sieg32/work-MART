const mysql = require('mysql2');



    const dbPool = mysql.createPool({
        host:'localhost',
        password:'Airtel@123',
        user:'yogesh',
        database:'mydb',
        idleTimeout: 60000
    }).promise();

    module.exports = dbPool;


