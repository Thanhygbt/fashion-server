const { db } = require("../configs/Database");

const listProducts = async () => {
    const [results] = await db.promise().query(
        "SELECT id, name, stock_quantity, price, category_id, created_at FROM products ORDER BY id ASC"
    );
    return results;
};

const listLogs = async () => {
    const sql = `
        SELECT il.*, p.name AS product_name
        FROM inventory_logs il
        JOIN products p ON p.id = il.product_id
        ORDER BY il.created_at DESC
    `;
    const [results] = await db.promise().query(sql);
    return results;
};

const adjustStock = async (payload) => {
    const connection = await db.promise().getConnection();
    try {
        await connection.beginTransaction();

        const [results] = await connection.query("SELECT stock_quantity FROM products WHERE id = ? FOR UPDATE", [payload.productId]);
        if (results.length === 0) {
            throw new Error("Product not found");
        }

        const nextStock = Number(results[0].stock_quantity) + Number(payload.changeAmount);
        if (nextStock < 0) {
            throw new Error("Stock cannot be negative");
        }

        await connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [nextStock, payload.productId]);
        await connection.query(
            "INSERT INTO inventory_logs (product_id, order_id, change_amount, reason) VALUES (?, NULL, ?, 'manual_adjustment')",
            [payload.productId, payload.changeAmount]
        );

        await connection.commit();
        return { productId: payload.productId, stockQuantity: nextStock };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = {
    listProducts,
    listLogs,
    adjustStock
};
