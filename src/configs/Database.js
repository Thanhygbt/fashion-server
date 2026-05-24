const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

const connectDb = () => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log("DB lỗi:", err);
        } else {
            console.log("Kết nối database thành công");
            connection.release();
        }
    });
};

module.exports = { db, connectDb };