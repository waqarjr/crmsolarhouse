import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.MYSQL_HOST,     // your mysql host
  user: process.env.MYSQL_USER,          // your mysql username
  password: process.env.MYSQL_PASSWORD,          // your mysql password
  database: process.env.MYSQL_DATABASE,      // your database name
  port: process.env.MYSQL_PORT             // your port (XAMPP = 3306, Laragon = 3306/3307)
});
