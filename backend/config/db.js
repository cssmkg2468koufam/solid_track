const mysql = require("mysql2");


const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "uok21CG22*",
  database: "solid_track",
  waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed: ");
    console.error(err.code);
    console.error(err.sqlMessage);
    process.exit(1);
  }else{
  console.log("Connected to MySQL database");
  connection.release();   
}
});

module.exports = pool.promise();  
