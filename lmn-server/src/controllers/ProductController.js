const productService = require("../services/ProductService");
const reviewModel = require("../models/ReviewModel");
const { requireAuth } = require("../middlewares/auth");

const getAllProducts = async (req, res) => {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const page = Math.max(1, parseInt(urlParams.searchParams.get("page"), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(urlParams.searchParams.get("limit"), 10) || 6));
    const filters = {
        categoryId: urlParams.searchParams.get("categoryId"),
        q: urlParams.searchParams.get("q"),
        sort: urlParams.searchParams.get("sort")
    };

    try {
        const result = await productService.fetchAllProducts(page, limit, filters);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            products: result.products,
            pagination: result.pagination
        }));
    } catch (err) {
        console.error("Loi GET /products:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Server error", detail: err.message }));
    }
};

const getProductById = async (req, res, id) => {
    try {
        const result = await productService.fetchProductById(id);
        if (!result.success) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: result.message }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result.product));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Server error" }));
    }
};

const getProductReviews = async (req, res, id, url) => {
    const page = Math.max(1, parseInt(url.searchParams.get("page"), 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(url.searchParams.get("limit"), 10) || 5));
    const offset = (page - 1) * limit;

    try {
        const total = await reviewModel.countReviewsByProduct(id);
        const reviews = await reviewModel.getReviewsByProduct(id, limit, offset);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Server error" }));
    }
};

const createProduct = async (req, res, body) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    let data;
    try {
        data = JSON.parse(body);
    } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Thiếu dữ liệu JSON" }));
    }

    try {
        await productService.createProduct(data);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Tạo sản phẩm thành công" }));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Server error", error: err.message }));
    }
};

const updateProduct = async (req, res, id, body) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    let data;
    try {
        data = JSON.parse(body);
    } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Thiếu dữ liệu JSON" }));
    }

    try {
        await productService.updateProduct(id, data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Cập nhật sản phẩm thành công" }));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Server error", error: err.message }));
    }
};

const deleteProduct = async (req, res, id) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    try {
        await productService.deleteProduct(id);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Xóa sản phẩm thành công" }));
    } catch (err) {
        res.writeHead(err.statusCode || 500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            message: err.statusCode ? err.message : "Server error",
            error: err.message
        }));
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductReviews,
    createProduct,
    updateProduct,
    deleteProduct
};
