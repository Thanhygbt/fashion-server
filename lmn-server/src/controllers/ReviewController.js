const reviewService = require("../services/ReviewService");
const { requireAuth } = require("../middlewares/auth");

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

const createReview = async (req, res, body) => {
    const user = requireAuth(req, res);
    if (!user) return;

    let data;
    try {
        data = JSON.parse(body);
    } catch {
        return sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
    }

    const result = await reviewService.createReviewService(user, data);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

module.exports = {
    createReview
};
