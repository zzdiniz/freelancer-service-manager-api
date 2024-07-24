import mysql from "mysql";

const conn = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "ServiceProviders",
});

export default conn;
