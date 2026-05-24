const { db } = require("../configs/Database");

const serializeCoupon = (coupon) => ({
    id: coupon.id,
    code: coupon.code,
    discountType: coupon.discount_type,
    discountValue: Number(coupon.discount_value),
    minOrderAmount: Number(coupon.min_order_amount),
    usageLimit: coupon.usage_limit,
    usedCount: coupon.used_count,
    isActive: Boolean(coupon.is_active),
    expiresAt: coupon.expires_at
});

const validateCoupon = async (code, subtotal) => {
    const [results] = await db.promise().query("SELECT * FROM coupons WHERE code = ?", [code]);
    if (results.length === 0) {
        return { success: false, message: "Coupon not found" };
    }

    const coupon = results[0];
    const now = new Date();

    if (!coupon.is_active) {
        return { success: false, message: "Coupon is inactive" };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        return { success: false, message: "Coupon has expired" };
    }

    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
        return { success: false, message: "Coupon usage limit reached" };
    }

    if (Number(subtotal) < Number(coupon.min_order_amount)) {
        return { success: false, message: "Order does not meet the coupon minimum" };
    }

    let discountAmount = 0;
    if (coupon.discount_type === "percent") {
        discountAmount = Math.min(Number(subtotal), (Number(subtotal) * Number(coupon.discount_value)) / 100);
    } else {
        discountAmount = Math.min(Number(subtotal), Number(coupon.discount_value));
    }

    return {
        success: true,
        coupon: {
            ...serializeCoupon(coupon),
            discountAmount
        }
    };
};

const listCoupons = async () => {
    const [results] = await db.promise().query("SELECT * FROM coupons ORDER BY created_at DESC");
    return results.map(serializeCoupon);
};

const findById = async (id) => {
    const [results] = await db.promise().query("SELECT * FROM coupons WHERE id = ?", [id]);
    return results[0] ? serializeCoupon(results[0]) : null;
};

const createCoupon = async (coupon) => {
    const sql = `
        INSERT INTO coupons
        (code, discount_type, discount_value, min_order_amount, usage_limit, is_active, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().query(sql, [
        coupon.code,
        coupon.discountType,
        coupon.discountValue,
        coupon.minOrderAmount,
        coupon.usageLimit,
        coupon.isActive,
        coupon.expiresAt
    ]);
    return result;
};

const updateCoupon = async (id, coupon) => {
    const sql = `
        UPDATE coupons
        SET code = ?, discount_type = ?, discount_value = ?, min_order_amount = ?, usage_limit = ?, is_active = ?, expires_at = ?
        WHERE id = ?
    `;
    const [result] = await db.promise().query(sql, [
        coupon.code,
        coupon.discountType,
        coupon.discountValue,
        coupon.minOrderAmount,
        coupon.usageLimit,
        coupon.isActive,
        coupon.expiresAt,
        id
    ]);
    return result;
};

const deleteCoupon = async (id) => {
    const [result] = await db.promise().query("DELETE FROM coupons WHERE id = ?", [id]);
    return result;
};

module.exports = {
    validateCoupon,
    listCoupons,
    findById,
    createCoupon,
    updateCoupon,
    deleteCoupon
};
