const productModel = require("../models/ProductModel");

const fetchAllProducts = async (page, limit, filters = {}) => {
    const offset = (page - 1) * limit;
    
    try {
        const total = await productModel.countProducts(filters);
        const results = await productModel.getAllProducts(limit, Number(offset), filters);
        
        return { 
            success: true, 
            products: results,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (err) {
        throw err;
    }
};

const fetchProductById = async (id) => {
    const product = await productModel.getProductById(id);
    if (!product) {
        return { success: false, message: "Product not found" };
    }
    return { success: true, product };
};

const createProduct = async (data) => {
    return await productModel.createProduct(data);
};

const updateProduct = async (id, data) => {
    return await productModel.updateProduct(id, data);
};

const deleteProduct = async (id) => {
    const blockers = await productModel.getDeleteBlockers(id);
    const hasHistory = blockers.orderItems > 0 || blockers.reviews > 0 || blockers.inventoryLogs > 0;

    if (hasHistory) {
        const details = [];
        if (blockers.orderItems > 0) details.push("đơn hàng");
        if (blockers.reviews > 0) details.push("đánh giá");
        if (blockers.inventoryLogs > 0) details.push("lịch sử kho");
        const err = new Error(`Không thể xóa sản phẩm đã có ${details.join(", ")}`);
        err.statusCode = 409;
        throw err;
    }

    return await productModel.deleteProduct(id);
};

module.exports = {
    fetchAllProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
