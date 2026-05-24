const inventoryController = require("../controllers/InventoryController");
const { readRequestBody } = require("../utils/HttpBody");

const inventoryRoute = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/inventory" && req.method === "GET") {
        return inventoryController.listInventory(req, res);
    }

    if (url.pathname === "/inventory/logs" && req.method === "GET") {
        return inventoryController.listInventoryLogs(req, res);
    }

    if (url.pathname === "/inventory/adjust" && req.method === "POST") {
        readRequestBody(req, res, (body) => { inventoryController.adjustInventory(req, res, body); });
        return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
};

module.exports = inventoryRoute;
