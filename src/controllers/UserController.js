const userService = require("../services/UserService");
const { requireAuth } = require("../middlewares/auth");

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

function serializeUser(user) {
    return {
        id: user.id,
        userName: user.user_name,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        phone: user.phone,
        address: user.address
    };
}

const register = async (req, res, body) => {
    let data;
    try {
        data = JSON.parse(body);
    } catch {
        try {
            data = Object.fromEntries(new URLSearchParams(body));
        } catch {
            return sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
        }
    }

    if (!data.userName || !data.email || !data.password || !data.otp) {
        return sendJson(res, 400, { message: "Thiếu trường bắt buộc" });
    }

    const result = await userService.verifyAndRegisterService(data);
    if (!result.success) return sendJson(res, 400, { message: result.message });
    sendJson(res, 201, { message: "Đăng ký thành công" });
};

const sendOTP = async (req, res, body) => {
    let data;
    try {
        data = JSON.parse(body);
    } catch {
        try {
            data = Object.fromEntries(new URLSearchParams(body));
        } catch {
            return sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
        }
    }

    if (!data.email || !data.userName) {
        return sendJson(res, 400, { message: "Thiếu email hoặc username" });
    }

    const result = await userService.sendOTPService(data);
    if (!result.success) return sendJson(res, 400, { message: result.message });
    sendJson(res, 200, { message: "OTP đã gửi tới email của bạn" });
};

const login = async (req, res, body) => {
    let data;
    try {
        data = JSON.parse(body);
    } catch {
        try {
            data = Object.fromEntries(new URLSearchParams(body));
        } catch {
            return sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
        }
    }

    const result = await userService.loginService(data);
    if (!result.success) {
        return sendJson(res, 400, { message: result.message });
    }

    res.setHeader("Set-Cookie", [
        `auth_user_id=${result.user.id}; Path=/; HttpOnly; SameSite=None; Secure`,
        `auth_user_role=${encodeURIComponent(result.user.role)}; Path=/; HttpOnly; SameSite=None; Secure`,
        `auth_user_name=${encodeURIComponent(result.user.user_name)}; Path=/; HttpOnly; SameSite=None; Secure`,
        `auth_user_email=${encodeURIComponent(result.user.email)}; Path=/; HttpOnly; SameSite=None; Secure`
    ]);

    sendJson(res, 200, {
        message: "Đăng nhập thành công",
        user: serializeUser(result.user)
    });
};

const getMe = async (req, res) => {
    const user = requireAuth(req, res);
    if (!user) return;

    const result = await userService.getMeService(user);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, { user: serializeUser(result.data.user) });
};

const updateMe = async (req, res, body) => {
    const user = requireAuth(req, res);
    if (!user) return;

    let data;
    try {
        data = JSON.parse(body);
    } catch {
        try {
            data = Object.fromEntries(new URLSearchParams(body));
        } catch {
            return sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
        }
    }

    const result = await userService.updateMeService(user, data);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, {
        message: result.data.message,
        user: serializeUser(result.data.user)
    });
};

const getAllUsers = async (req, res) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    const result = await userService.getAllUsersService();
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

const adminUpdateUser = async (req, res, id, body) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    let data;
    try {
        data = JSON.parse(body);
    } catch {
        try {
            data = Object.fromEntries(new URLSearchParams(body));
        } catch {
            return sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
        }
    }

    const result = await userService.adminUpdateUserService(id, data);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

const deleteUser = async (req, res, id) => {
    const user = requireAuth(req, res, ["admin"]);
    if (!user) return;

    const result = await userService.deleteUserService(id, user);
    if (!result.success) return sendJson(res, result.statusCode, { message: result.message });
    sendJson(res, result.statusCode, result.data);
};

const forgotPassword = async (req, res, body) => {
    let data;
    try {
        data = JSON.parse(body);
    } catch {
        return sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
    }

    if (!data.email) {
        return sendJson(res, 400, { message: "Thiếu email" });
    }

    const result = await userService.sendForgotPasswordOTPService(data);
    if (!result.success) return sendJson(res, 400, { message: result.message });
    sendJson(res, 200, { message: "OTP đã gửi thành công tới email của bạn" });
};

const resetPassword = async (req, res, body) => {
    let data;
    try {
        data = JSON.parse(body);
    } catch {
        return sendJson(res, 400, { message: "Thiếu dữ liệu JSON" });
    }

    if (!data.email || !data.otp || !data.newPassword) {
        return sendJson(res, 400, { message: "Thiếu trường bắt buộc" });
    }

    const result = await userService.resetPasswordService(data);
    if (!result.success) return sendJson(res, 400, { message: result.message });
    sendJson(res, 200, { message: "Đổi mật khẩu thành công" });
};

module.exports = { register, login, sendOTP, getMe, updateMe, getAllUsers, adminUpdateUser, deleteUser, forgotPassword, resetPassword };
