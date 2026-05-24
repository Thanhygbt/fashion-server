const orderController = require("../controllers/OrderController");
const { readRequestBody } = require("../utils/HttpBody");

const orderRoute = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/orders" && req.method === "POST") {
        readRequestBody(req, res, (body) => { orderController.createOrder(req, res, body); });
        return;
    }

    if (url.pathname === "/orders" && req.method === "GET") {
        orderController.getOrders(req, res, {
            userId: url.searchParams.get("userId"),
            status: url.searchParams.get("status")
        });
        return;
    }

    if (url.pathname.match(/^\/orders\/\d+$/) && req.method === "GET") {
        const orderId = url.pathname.split("/")[2];
        orderController.getOrderById(req, res, orderId);
        return;
    }

    if (url.pathname.match(/^\/orders\/\d+\/send-email$/) && req.method === "POST") {
        const orderId = url.pathname.split("/")[2];
        orderController.triggerOrderEmail(req, res, orderId);
        return;
    }

    if (url.pathname.match(/^\/orders\/\d+\/cancel$/) && req.method === "POST") {
        const orderId = url.pathname.split("/")[2];
        orderController.cancelPendingOrder(req, res, orderId);
        return;
    }

    if (url.pathname.match(/^\/orders\/\d+\/status$/) && req.method === "PATCH") {
        const orderId = url.pathname.split("/")[2];
        readRequestBody(req, res, (body) => { orderController.updateOrderStatus(req, res, orderId, body); });
        return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
};

module.exports = orderRoute;
