const productController = require("../controllers/ProductController");
const { readRequestBody } = require("../utils/HttpBody");

const productRoute = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.match(/^\/products\/\d+\/reviews$/) && req.method === "GET") {
        const id = url.pathname.split("/")[2];
        return productController.getProductReviews(req, res, id, url);
    }

    if (url.pathname === "/products" && req.method === "GET") {
        return productController.getAllProducts(req, res);
    }

    if (url.pathname === "/products" && req.method === "POST") {
        readRequestBody(req, res, (body) => { productController.createProduct(req, res, body); });
        return;
    }

    if (url.pathname.match(/^\/products\/\d+$/)) {
        const id = url.pathname.split("/")[2];
        if (req.method === "GET") {
            return productController.getProductById(req, res, id);
        }
        if (req.method === "PUT") {
            readRequestBody(req, res, (body) => { productController.updateProduct(req, res, id, body); });
            return;
        }
        if (req.method === "DELETE") {
            return productController.deleteProduct(req, res, id);
        }
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
};

module.exports = productRoute;
