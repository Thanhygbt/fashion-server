const { db } = require("../configs/Database");

function buildProductFilters(filters = {}) {
    const conditions = [];
    const params = [];

    const categoryId = Number(filters.categoryId);
    if (Number.isInteger(categoryId) && categoryId > 0) {
        conditions.push("category_id = ?");
        params.push(categoryId);
    }

    const q = String(filters.q || "").trim();
    if (q) {
        conditions.push("(name LIKE ? OR description LIKE ?)");
        params.push(`%${q}%`, `%${q}%`);
    }

    return {
        whereSql: conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "",
        params
    };
}

function buildProductSort(sort) {
    if (sort === "price_asc") return " ORDER BY price ASC, id DESC";
    if (sort === "price_desc") return " ORDER BY price DESC, id DESC";
    return " ORDER BY id DESC";
}

const getAllProducts = async (limit, offset, filters = {}) => {
    const { whereSql, params } = buildProductFilters(filters);
    const sql = `SELECT * FROM products${whereSql}${buildProductSort(filters.sort)} LIMIT ? OFFSET ?`;
    const [results] = await db.promise().query(sql, [...params, limit, offset]);
    return results;
};

const countProducts = async (filters = {}) => {
    const { whereSql, params } = buildProductFilters(filters);
    const sql = `SELECT COUNT(*) as total FROM products${whereSql}`;
    const [results] = await db.promise().query(sql, params);
    return results[0].total;
};

const getProductById = async (id) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    const [results] = await db.promise().query(sql, [id]);
    return results[0];
};

const getProductsByIds = async (productIds) => {
    if (!productIds || productIds.length === 0) {
        return [];
    }
    const sql = "SELECT * FROM products WHERE id IN (?)";
    const [results] = await db.promise().query(sql, [productIds]);
    return results;
};

const createProduct = async (product) => {
    const sql = `
        INSERT INTO products
        (name, description, price, image_url, category_id, stock_quantity, sizes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().query(sql, [
        product.name,
        product.description,
        product.price,
        product.imageUrl,
        product.categoryId,
        product.stockQuantity,
        product.sizes || "S,M,L,XL"
    ]);
    return result;
};

const updateProduct = async (id, product) => {
    const sql = `
        UPDATE products
        SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, stock_quantity = ?, sizes = ?
        WHERE id = ?
    `;
    const [result] = await db.promise().query(sql, [
        product.name,
        product.description,
        product.price,
        product.imageUrl,
        product.categoryId,
        product.stockQuantity,
        product.sizes,
        id
    ]);
    return result;
};

const getDeleteBlockers = async (id) => {
    const [orderItems] = await db.promise().query("SELECT COUNT(*) AS total FROM order_items WHERE product_id = ?", [id]);
    const [reviews] = await db.promise().query("SELECT COUNT(*) AS total FROM reviews WHERE product_id = ?", [id]);
    const [inventoryLogs] = await db.promise().query("SELECT COUNT(*) AS total FROM inventory_logs WHERE product_id = ?", [id]);

    return {
        orderItems: Number(orderItems[0].total || 0),
        reviews: Number(reviews[0].total || 0),
        inventoryLogs: Number(inventoryLogs[0].total || 0)
    };
};

const deleteProduct = async (id) => {
    const [result] = await db.promise().query("DELETE FROM products WHERE id = ?", [id]);
    return result;
};

module.exports = {
    getAllProducts,
    countProducts,
    getProductById,
    getProductsByIds,
    createProduct,
    updateProduct,
    getDeleteBlockers,
    deleteProduct
};
