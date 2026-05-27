require("./loadEnv");

const http = require("http");
const userRoute = require("./src/routes/UserRoute");
const productRoute = require("./src/routes/ProductRoute");
const orderRoute = require("./src/routes/OrderRoute");
const couponRoute = require("./src/routes/CouponRoute");
const reviewRoute = require("./src/routes/ReviewRoute");
const inventoryRoute = require("./src/routes/InventoryRoute");
const { connectDb } = require("./src/configs/Database");

const requiredEnv = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
    console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
    process.exit(1);
}

connectDb();

const allowedOrigin = process.env.FRONTEND_URL || "*";

const server = http.createServer((req, res) => {
    const requestOrigin = req.headers.origin;
    const origin = allowedOrigin === "*" ? (requestOrigin || "*") : allowedOrigin;

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-user-id, x-user-role, x-user-name, x-user-email");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    if (
        req.url.startsWith("/register")
        || req.url.startsWith("/login")
        || req.url.startsWith("/send-otp")
        || req.url.startsWith("/forgot-password")
        || req.url.startsWith("/reset-password")
        || req.url.startsWith("/me")
        || req.url.startsWith("/users")
    ) {
        return userRoute(req, res);
    }

    if (req.url.startsWith("/products")) {
        return productRoute(req, res);
    }

    if (
        req.url.startsWith("/orders")
    ) {
        return orderRoute(req, res);
    }

    if (req.url.startsWith("/coupons")) {
        return couponRoute(req, res);
    }

    if (req.url.startsWith("/reviews")) {
        return reviewRoute(req, res);
    }

    if (req.url.startsWith("/inventory")) {
        return inventoryRoute(req, res);
    }

    // Diagnostic endpoint
    if (req.url === "/diagnose" && req.method === "GET") {
        const hasEmailUser = !!process.env.EMAIL_USER;
        const hasEmailPass = !!process.env.EMAIL_PASS;
        const hasResendApiKey = !!process.env.RESEND_API_KEY;
        const emailUserValue = hasEmailUser ? process.env.EMAIL_USER : "NOT_SET";
        const emailPassValue = hasEmailPass ? "***HIDDEN***" : "NOT_SET";

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            environment: process.env.NODE_ENV || "development",
            emailConfigured: (hasEmailUser && hasEmailPass) || hasResendApiKey,
            smtpConfigured: hasEmailUser && hasEmailPass,
            resendConfigured: hasResendApiKey,
            emailUser: emailUserValue,
            emailPass: emailPassValue,
            port: process.env.PORT || 3000,
            dbHost: process.env.DB_HOST ? "SET" : "NOT_SET",
            dbUser: process.env.DB_USER ? "SET" : "NOT_SET",
            dbName: process.env.DB_NAME ? "SET" : "NOT_SET",
            frontendUrl: process.env.FRONTEND_URL || "NOT_SET",
            message: "Email config must be set: EMAIL_USER/EMAIL_PASS or RESEND_API_KEY"
        }, null, 2));
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});
