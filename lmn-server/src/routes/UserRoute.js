const userController = require("../controllers/UserController");
const { readRequestBody } = require("../utils/HttpBody");

const userRoute = (req, res) => {
    if (req.url.startsWith("/register") && req.method === "POST") {
        readRequestBody(req, res, (body) => { userController.register(req, res, body); });
        return;
    }

    if (req.url.startsWith("/login") && req.method === "POST") {
        readRequestBody(req, res, (body) => { userController.login(req, res, body); });
        return;
    }

    if (req.url.startsWith("/forgot-password") && req.method === "POST") {
        readRequestBody(req, res, (body) => { userController.forgotPassword(req, res, body); });
        return;
    }

    if (req.url.startsWith("/reset-password") && req.method === "POST") {
        readRequestBody(req, res, (body) => { userController.resetPassword(req, res, body); });
        return;
    }

    if (req.url.startsWith("/send-otp") && req.method === "POST") {
        readRequestBody(req, res, (body) => { userController.sendOTP(req, res, body); });
        return;
    }

    if (req.url === "/me" && req.method === "GET") {
        return userController.getMe(req, res);
    }

    if (req.url === "/me" && req.method === "PUT") {
        readRequestBody(req, res, (body) => { userController.updateMe(req, res, body); });
        return;
    }

    if (req.url === "/users" && req.method === "GET") {
        return userController.getAllUsers(req, res);
    }

    const userMatch = req.url.match(/^\/users\/(\d+)$/);
    if (userMatch) {
        const id = userMatch[1];
        if (req.method === "PUT") {
            readRequestBody(req, res, (body) => { userController.adminUpdateUser(req, res, id, body); });
            return;
        }
        if (req.method === "DELETE") {
            return userController.deleteUser(req, res, id);
        }
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route not found");
};

module.exports = userRoute;
