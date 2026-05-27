const userModel = require("../models/UserModel");
const { db } = require("../configs/Database");
const { sendOTP } = require("../utils/GetOTP");

const sendOTPService = async (data) => {
    const { email, userName } = data;

    try {
        const results = await userModel.findByEmail(email);
        if (results.length > 0 && results[0].status === "active") {
            return { success: false, message: "Email đã tồn tại" };
        }

        if (userName) {
            const userResults = await userModel.findByUserName(userName);
            if (userResults.length > 0 && userResults[0].status === "active") {
                return { success: false, message: "Username đã tồn tại" };
            }
        }

        const otp = await sendOTP(email);
        await userModel.saveOTP(email, otp);
        return { success: true, message: "OTP đã gửi thành công" };
    } catch (err) {
        return { success: false, message: err.message || "Server error" };
    }
};

const verifyAndRegisterService = async (data) => {
    const { email, otp, password, userName, fullName, phone, address } = data;

    try {
        const isValid = await userModel.verifyOTP(email, otp);
        if (!isValid) {
            return { success: false, message: "Mã OTP không đúng hoặc đã hết hạn" };
        }

        const user = {
            userName,
            email,
            password,
            fullName: fullName || "",
            phone: phone || "",
            address: address || "",
            role: "customer",
            status: "active"
        };

        const results = await userModel.findByEmail(email);
        if (results.length > 0) {
            const sqlUpdate = "UPDATE users SET user_name=?, password=?, full_name=?, phone=?, address=?, status='active' WHERE email=?";
            await db.promise().query(sqlUpdate, [userName, password, user.fullName, user.phone, user.address, email]);
            return { success: true };
        }

        await userModel.register(user);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || "Server error" };
    }
};

const loginService = async (data) => {
    try {
        const user = await userModel.login(data.userName, data.password);
        if (!user) {
            return { success: false, message: "Sai username hoặc password" };
        }
        if (user.status !== "active") {
            return { success: false, message: "Tài khoản chưa được xác thực email" };
        }
        return { success: true, user };
    } catch (err) {
        return { success: false, message: err.message || "Server error" };
    }
};

const sendForgotPasswordOTPService = async (data) => {
    const { email } = data;
    try {
        const results = await userModel.findByEmail(email);
        if (results.length === 0) {
            return { success: false, message: "Email không tồn tại trong hệ thống" };
        }

        const otp = await sendOTP(email);
        await userModel.saveOTP(email, otp);
        return { success: true, message: "OTP đã gửi thành công" };
    } catch (err) {
        return { success: false, message: `Gửi OTP thất bại: ${err.message}` };
    }
};

const resetPasswordService = async (data) => {
    const { email, otp, newPassword } = data;
    try {
        const isValid = await userModel.verifyOTP(email, otp);
        if (!isValid) {
            return { success: false, message: "Mã OTP không đúng hoặc đã hết hạn" };
        }

        await userModel.updatePasswordByEmail(email, newPassword);
        return { success: true, message: "Đổi mật khẩu thành công" };
    } catch (err) {
        return { success: false, message: err.message || "Server error" };
    }
};

const getMeService = async (user) => {
    try {
        const foundUser = await userModel.findById(user.id);
        if (!foundUser) return { success: false, statusCode: 404, message: "User not found" };
        return { success: true, statusCode: 200, data: { user: foundUser } };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

const updateMeService = async (user, data) => {
    const profile = {
        fullName: data.fullName || "",
        phone: data.phone || "",
        address: data.address || ""
    };
    try {
        await userModel.updateProfile(user.id, profile);
        const updatedUser = await userModel.findById(user.id);
        return { success: true, statusCode: 200, data: { message: "Cập nhật hồ sơ thành công", user: updatedUser } };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

const getAllUsersService = async () => {
    try {
        const results = await userModel.getAllUsers();
        return { success: true, statusCode: 200, data: results };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

const adminUpdateUserService = async (id, data) => {
    const allowedRoles = ["customer", "admin"];
    const allowedStatuses = ["active", "inactive"];

    if (!allowedRoles.includes(data.role)) {
        return { success: false, statusCode: 400, message: "Invalid role" };
    }

    if (!allowedStatuses.includes(data.status)) {
        return { success: false, statusCode: 400, message: "Invalid status" };
    }

    try {
        await userModel.adminUpdateUser(id, data);
        return { success: true, statusCode: 200, data: { message: "Cập nhật người dùng thành công" } };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

const deleteUserService = async (id, actor) => {
    if (Number(actor.id) === Number(id)) {
        return { success: false, statusCode: 400, message: "Không thể khóa tài khoản admin đang đăng nhập" };
    }

    try {
        await userModel.deleteUser(id);
        return { success: true, statusCode: 200, data: { message: "Khóa tài khoản người dùng thành công" } };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

module.exports = {
    sendOTPService,
    verifyAndRegisterService,
    loginService,
    sendForgotPasswordOTPService,
    resetPasswordService,
    getMeService,
    updateMeService,
    getAllUsersService,
    adminUpdateUserService,
    deleteUserService
};
