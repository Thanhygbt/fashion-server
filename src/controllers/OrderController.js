const { requireAuth } = require("../middlewares/auth");
const orderService = require("../services/OrderService");

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

const createOrder = async (req, res, rawBody) => {
    const user = requireAuth(req, res);
    if (!user) return;

    let data;
    try {
        data = JSON.parse(rawBody);
    } catch {
        return sendJson(res, 400, { message: "Invalid JSON" });
    }

    const result = await orderService.createOrderService(user, data);
    if (!result.success) {
        return sendJson(res, result.statusCode, { message: result.message, detail: result.detail });
    }
    const payload = {
        message: result.message,
        order: result.order,
    };
    if (result.checkoutUrl) payload.checkoutUrl = result.checkoutUrl;
    sendJson(res, result.statusCode, payload);
};

const getOrders = async (req, res, filters) => {
    const user = requireAuth(req, res);
    if (!user) return;

    const result = await orderService.getOrdersService(user, filters);
    if (!result.success) {
        return sendJson(res, result.statusCode, { message: result.message, detail: result.detail });
    }
    sendJson(res, result.statusCode, result.data);
};

const getOrderById = async (req, res, orderId) => {
    const user = requireAuth(req, res);
    if (!user) return;

    const result = await orderService.getOrderByIdService(user, orderId);
    if (!result.success) {
        return sendJson(res, result.statusCode, { message: result.message });
    }
    sendJson(res, result.statusCode, result.data);
};

const triggerOrderEmail = async (req, res, orderId) => {
    const user = requireAuth(req, res);
    if (!user) return;

    const result = await orderService.triggerOrderEmailService(user, orderId);
    sendJson(res, result.statusCode, { message: result.message });
};

const cancelPendingOrder = async (req, res, orderId) => {
    const user = requireAuth(req, res);
    if (!user) return;

    const result = await orderService.cancelPendingOrderService(user, orderId);
    if (!result.success) {
        return sendJson(res, result.statusCode, { message: result.message });
    }
    sendJson(res, result.statusCode, { message: result.message, order: result.order });
};

const updateOrderStatus = async (req, res, orderId, rawBody) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    let data;
    try {
        data = JSON.parse(rawBody);
    } catch {
        return sendJson(res, 400, { message: "Invalid JSON" });
    }

    const result = await orderService.updateOrderStatusService(user, orderId, data);
    if (!result.success) {
        return sendJson(res, result.statusCode, { message: result.message });
    }
    sendJson(res, result.statusCode, { message: result.message, order: result.order });
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    triggerOrderEmail,
    cancelPendingOrder,
    updateOrderStatus
};
