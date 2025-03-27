const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mysql = require("mysql2");

function conectarMysql(host) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: host,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        connection.connect(function (err) {
            if (err) {
                console.log("Error connecting: " + err.stack);
                reject(err);  
                return;
            }

            console.log("Connected as id " + connection.threadId);
            resolve(connection);  
        });
    });
}
//conectarMysql("localhost")

module.exports = conectarMysql;
