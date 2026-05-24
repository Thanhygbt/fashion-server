require("./loadEnv");
const { db } = require("./src/configs/Database");

const migrations = [
    "ALTER TABLE products ADD COLUMN sizes VARCHAR(255) DEFAULT 'S,M,L,XL' AFTER stock_quantity",
    "ALTER TABLE order_items ADD COLUMN size VARCHAR(50) AFTER quantity"
];

async function migrate() {
    console.log("Starting migration...");
    for (const sql of migrations) {
        try {
            await new Promise((resolve, reject) => {
                db.query(sql, (err, results) => {
                    if (err) {
                        if (err.code === 'ER_DUP_COLUMN_NAME') {
                            console.log(`Column already exists, skipping: ${sql.split(' ')[2]}`);
                            return resolve();
                        }
                        return reject(err);
                    }
                    console.log(`Executed: ${sql}`);
                    resolve(results);
                });
            });
        } catch (error) {
            console.error(`Error executing ${sql}:`, error);
        }
    }
    console.log("Migration finished.");
    process.exit(0);
}

migrate();
