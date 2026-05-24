require("./loadEnv");
const { db } = require("./src/configs/Database");

const queries = [
    "ALTER TABLE orders MODIFY COLUMN status ENUM('pending','processing','shipped','delivered','completed','cancelled') DEFAULT 'pending'",
    "UPDATE orders SET status = 'completed' WHERE status = 'delivered'",
    "UPDATE orders SET status = 'processing' WHERE status = 'shipped'",
    "ALTER TABLE orders MODIFY COLUMN status ENUM('pending','processing','completed','cancelled') DEFAULT 'pending'"
];

async function run() {
    console.log("Migrating order status enum...");
    try {
        for (const sql of queries) {
            await db.promise().query(sql);
            console.log(`Executed: ${sql}`);
        }
        console.log("Order status migration finished.");
    } catch (err) {
        console.error("Order status migration failed:", err.message);
        process.exitCode = 1;
    } finally {
        db.end();
    }
}

run();
