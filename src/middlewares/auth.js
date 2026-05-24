function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

function parseCookies(req) {
    const header = req.headers.cookie;
    if (!header) return {};
    return header.split(";").reduce((cookies, pair) => {
        const [key, ...valueParts] = pair.split("=");
        if (!key) return cookies;
        cookies[key.trim()] = decodeURIComponent(valueParts.join("=")).trim();
        return cookies;
    }, {});
}

function checkAuth(req) {
    const cookies = parseCookies(req);
    const id = Number(req.headers["x-user-id"] || cookies.auth_user_id);
    if (!id) {
        return null;
    }

    const role = (req.headers["x-user-role"] || cookies.auth_user_role || "customer").toString().toLowerCase();
    const userName = req.headers["x-user-name"] || cookies.auth_user_name || "";
    const email = req.headers["x-user-email"] || cookies.auth_user_email || "";

    return {
        id,
        role,
        userName,
        user_name: userName,
        email
    };
}

function requireAuth(req, res, allowedRoles = []) {
    const user = checkAuth(req);

    if (!user) {
        sendJson(res, 401, { message: "Unauthorized" });
        return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        sendJson(res, 403, { message: "Forbidden" });
        return null;
    }

    req.user = user;
    return user;
}

module.exports = { checkAuth, requireAuth };
