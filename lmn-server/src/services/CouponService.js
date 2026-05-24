const couponModel = require("../models/CouponModel");

const validateCouponService = async (code, subtotal) => {
    if (!code) return { success: false, statusCode: 400, message: "Coupon code is required" };

    try {
        const result = await couponModel.validateCoupon(code, subtotal);
        if (!result.success) return { success: false, statusCode: 400, message: result.message };
        return { success: true, statusCode: 200, data: result.coupon };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

const getCouponsService = async () => {
    try {
        const coupons = await couponModel.listCoupons();
        return { success: true, statusCode: 200, data: { coupons } };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

const createCouponService = async (coupon) => {
    if (!coupon.code || !["percent", "fixed"].includes(coupon.discountType) || coupon.discountValue <= 0) {
        return { success: false, statusCode: 400, message: "Coupon payload không hợp lệ" };
    }

    try {
        const result = await couponModel.createCoupon(coupon);
        return { success: true, statusCode: 201, data: { message: "Tạo coupon thành công", couponId: result.insertId } };
    } catch (err) {
        return { success: false, statusCode: 500, message: err.message || "Server error" };
    }
};

const updateCouponService = async (couponId, coupon) => {
    if (!coupon.code || !["percent", "fixed"].includes(coupon.discountType) || coupon.discountValue <= 0) {
        return { success: false, statusCode: 400, message: "Coupon payload không hợp lệ" };
    }

    try {
        await couponModel.updateCoupon(couponId, coupon);
        return { success: true, statusCode: 200, data: { message: "Cập nhật coupon thành công" } };
    } catch (err) {
        return { success: false, statusCode: 500, message: err.message || "Server error" };
    }
};

const deleteCouponService = async (couponId) => {
    try {
        await couponModel.deleteCoupon(couponId);
        return { success: true, statusCode: 200, data: { message: "Xóa coupon thành công" } };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

module.exports = { validateCouponService, getCouponsService, createCouponService, updateCouponService, deleteCouponService };
