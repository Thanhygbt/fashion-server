const orderModel = require("../models/OrderModel");
const reviewModel = require("../models/ReviewModel");

const createReviewService = async (user, data) => {
    const productId = Number(data.productId);
    const rating = Number(data.rating);
    const comment = data.comment || "";

    if (!productId || rating < 1 || rating > 5) {
        return { success: false, statusCode: 400, message: "Dữ liệu review không hợp lệ" };
    }

    try {
        const hasPurchased = await orderModel.hasPurchasedProduct(user.id, productId);
        if (!hasPurchased) return { success: false, statusCode: 403, message: "Bạn chỉ có thể review sau khi đơn hàng hoàn thành" };

        const hasReviewed = await reviewModel.hasExistingReview(user.id, productId);
        if (hasReviewed) return { success: false, statusCode: 400, message: "Bạn đã review sản phẩm này" };

        const result = await reviewModel.createReview({ userId: user.id, productId, rating, comment });

        return { success: true, statusCode: 201, data: { message: "Review đã được lưu", reviewId: result.insertId } };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

module.exports = { createReviewService };
