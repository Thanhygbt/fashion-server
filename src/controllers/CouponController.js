const couponService = require("../services/CouponService");
const { requireAuth } = require("../middlewares/auth");

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

function parseBody(body, res) {
    try {
        return JSON.parse(body);
    } catch {
        try {
            return Object.fromEntries(new URLSearchParams(body));
        } catch {
            sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
            return null;
        }
    }
}

function normalizeCouponPayload(data) {
    return {
        code: String(data.code || "").trim().toUpperCase(),
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minOrderAmount: Number(data.minOrderAmount || 0),
        usageLimit: data.usageLimit === null || data.usageLimit === "" || data.usageLimit === undefined ? null : Number(data.usageLimit),
        isActive: data.isActive === undefined ? true : Boolean(data.isActive),
        expiresAt: data.expiresAt || null
    };
}

const validateCoupon = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const code = url.searchParams.get("code");
    const subtotal = Number(url.searchParams.get("subtotal") || 0);

    const result = await couponService.validateCouponService(code, subtotal);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

const listCoupons = async (req, res) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    const result = await couponService.getCouponsService();
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

const createCoupon = async (req, res, body) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    const data = parseBody(body, res);
    if (!data) return;

    const coupon = normalizeCouponPayload(data);

    const result = await couponService.createCouponService(coupon);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

const updateCoupon = async (req, res, couponId, body) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    const data = parseBody(body, res);
    if (!data) return;

    const coupon = normalizeCouponPayload(data);

    const result = await couponService.updateCouponService(couponId, coupon);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

const deleteCoupon = async (req, res, couponId) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    const result = await couponService.deleteCouponService(couponId);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

module.exports = {
    validateCoupon,
    listCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
};
