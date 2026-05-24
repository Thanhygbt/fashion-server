const { db } = require("../configs/Database");

const hasExistingReview = async (userId, productId) => {
    const [results] = await db.promise().query(
        "SELECT id FROM reviews WHERE user_id = ? AND product_id = ? LIMIT 1",
        [userId, productId]
    );
    return results.length > 0;
};

const createReview = async (review) => {
    const sql = "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)";
    const [result] = await db.promise().query(sql, [review.userId, review.productId, review.rating, review.comment]);
    return result;
};

const countReviewsByProduct = async (productId) => {
    const [results] = await db.promise().query(
        "SELECT COUNT(*) AS total FROM reviews WHERE product_id = ?",
        [productId]
    );
    return Number(results[0].total || 0);
};

const getReviewsByProduct = async (productId, limit = 5, offset = 0) => {
    const sql = `
        SELECT r.id, r.rating, r.comment, r.created_at, u.user_name
        FROM reviews r
        JOIN users u ON u.id = r.user_id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
    `;

    const [results] = await db.promise().query(sql, [productId, Number(limit), Number(offset)]);
    return results;
};

module.exports = {
    hasExistingReview,
    createReview,
    countReviewsByProduct,
    getReviewsByProduct
};
