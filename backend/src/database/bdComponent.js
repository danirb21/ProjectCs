const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

class ComponentBd {
    constructor(host) {
        this.pool = mysql.createPool({
            host: host,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async select(table, conditions = {}) {
        let query = `SELECT * FROM ${table}`;
        let values = [];

        if (Object.keys(conditions).length > 0) {
            const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(" AND ");
            query += ` WHERE ${whereClause}`;
            values = Object.values(conditions);
        }

        const [rows] = await this.pool.query(query, values);
        return rows;
    }

    async insert(table, data) {
        const keys = Object.keys(data).join(", ");
        const values = Object.values(data);
        const placeholders = values.map(() => "?").join(", ");

        const query = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;
        const [result] = await this.pool.query(query, values);
        return result.insertId;
    }

    async update(table, data, conditions) {
        const setClause = Object.keys(data)
            .map((key) => `${key} = ?`)
            .join(", ");

        const whereParts = [];
        const values = [...Object.values(data)];

        for (const key in conditions) {
            const condition = conditions[key];
            if (typeof condition === "object" && condition.raw) {
                whereParts.push(`${condition.raw}`);
                values.push(condition.value);
            } else {
                whereParts.push(`${key} = ?`);
                values.push(condition);
            }

        }

        const whereClause = whereParts.join(" AND ");
        const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

        const [result] = await this.pool.query(query, values);
        return result.affectedRows > 0;
    }


    async delete(table, conditions) {
        const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(" AND ");
        const values = Object.values(conditions);

        const query = `DELETE FROM ${table} WHERE ${whereClause}`;
        const [result] = await this.pool.query(query, values);
        return result.affectedRows > 0;
    }
    async close() {
        await this.pool.end();
    }
}

module.exports = ComponentBd;
