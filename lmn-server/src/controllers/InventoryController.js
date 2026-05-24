const { requireAuth } = require("../middlewares/auth");
const inventoryService = require("../services/InventoryService");

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

const listInventory = async (req, res) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    const result = await inventoryService.getInventoryListService();
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

const listInventoryLogs = async (req, res) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    const result = await inventoryService.getInventoryLogsService();
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

const adjustInventory = async (req, res, body) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    let data;
    try {
        data = JSON.parse(body);
    } catch {
        return sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
    }

    const result = await inventoryService.adjustInventoryService(data);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

module.exports = {
    listInventory,
    listInventoryLogs,
    adjustInventory
};
