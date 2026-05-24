const reviewController = require("../controllers/ReviewController");
const { readRequestBody } = require("../utils/HttpBody");

const reviewRoute = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/reviews" && req.method === "POST") {
        readRequestBody(req, res, (body) => { reviewController.createReview(req, res, body); });
        return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
};

module.exports = reviewRoute;
