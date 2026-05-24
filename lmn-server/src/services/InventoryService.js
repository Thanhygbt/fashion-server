const inventoryModel = require("../models/InventoryModel");

const getInventoryListService = async () => {
    try {
        const products = await inventoryModel.listProducts();
        return { success: true, statusCode: 200, data: { products } };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

const getInventoryLogsService = async () => {
    try {
        const logs = await inventoryModel.listLogs();
        return { success: true, statusCode: 200, data: { logs } };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

const adjustInventoryService = async (data) => {
    const payload = {
        productId: Number(data.productId),
        changeAmount: Number(data.changeAmount)
    };

    if (!payload.productId || !Number.isInteger(payload.changeAmount) || payload.changeAmount === 0) {
        return { success: false, statusCode: 400, message: "Payload điều chỉnh kho không hợp lệ" };
    }

    try {
        const result = await inventoryModel.adjustStock(payload);
        return { success: true, statusCode: 200, data: { message: "Điều chỉnh tồn kho thành công", inventory: result } };
    } catch (err) {
        const statusCode = err.message === "Product not found" ? 404 : err.message === "Stock cannot be negative" ? 400 : 500;
        return { success: false, statusCode, message: err.message };
    }
};

module.exports = { getInventoryListService, getInventoryLogsService, adjustInventoryService };
