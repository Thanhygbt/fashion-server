const couponController = require("../controllers/CouponController");
const { readRequestBody } = require("../utils/HttpBody");

const couponRoute = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/coupons/validate" && req.method === "GET") {
        return couponController.validateCoupon(req, res);
    }

    if (url.pathname === "/coupons" && req.method === "GET") {
        return couponController.listCoupons(req, res);
    }

    if (url.pathname === "/coupons" && req.method === "POST") {
        readRequestBody(req, res, (body) => { couponController.createCoupon(req, res, body); });
        return;
    }

    if (url.pathname.match(/^\/coupons\/\d+$/) && req.method === "PUT") {
        const couponId = url.pathname.split("/")[2];
        readRequestBody(req, res, (body) => { couponController.updateCoupon(req, res, couponId, body); });
        return;
    }

    if (url.pathname.match(/^\/coupons\/\d+$/) && req.method === "DELETE") {
        const couponId = url.pathname.split("/")[2];
        return couponController.deleteCoupon(req, res, couponId);
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
};

module.exports = couponRoute;
