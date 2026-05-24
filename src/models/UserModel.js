const { db } = require("../configs/Database");

const register = async (user) => {
    const sql = `
        INSERT INTO users
        (user_name, email, password, full_name, phone, address, role, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().query(sql, [
        user.userName, user.email, user.password, user.fullName, user.phone, user.address, user.role, user.status
    ]);
    return result;
};

const findByEmail = async (email) => {
    const [results] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    return results;
};

const findById = async (id) => {
    const [results] = await db.promise().query("SELECT * FROM users WHERE id = ?", [id]);
    return results[0];
};

const login = async (userName, password) => {
    const sql = "SELECT * FROM users WHERE user_name = ?";
    const [results] = await db.promise().query(sql, [userName]);
    if (results.length === 0) return false;

    const user = results[0];
    if (password !== user.password) return false;
    return user;
};

const saveOTP = async (email, otp) => {
    await db.promise().query("DELETE FROM otps WHERE email = ?", [email]);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const [result] = await db.promise().query("INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)", [email, otp, expiresAt]);
    return result;
};

const verifyOTP = async (email, otp) => {
    const [results] = await db.promise().query(
        "SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()",
        [email, otp]
    );
    if (results.length > 0) {
        await db.promise().query("DELETE FROM otps WHERE email = ?", [email]);
        return true;
    }
    return false;
};

const updateStatus = async (email, status) => {
    const [result] = await db.promise().query("UPDATE users SET status = ? WHERE email = ?", [status, email]);
    return result;
};

const findByUserName = async (userName) => {
    const [results] = await db.promise().query("SELECT * FROM users WHERE user_name = ?", [userName]);
    return results;
};

const updateProfile = async (userId, profile) => {
    const sql = `
        UPDATE users
        SET full_name = ?, phone = ?, address = ?
        WHERE id = ?
    `;
    const [result] = await db.promise().query(sql, [profile.fullName, profile.phone, profile.address, userId]);
    return result;
};

const getAllUsers = async () => {
    const [results] = await db.promise().query("SELECT id, user_name, email, full_name, phone, address, role, status, created_at FROM users");
    return results;
};

const adminUpdateUser = async (id, user) => {
    const sql = `
        UPDATE users
        SET user_name = ?, email = ?, full_name = ?, phone = ?, address = ?, role = ?, status = ?
        WHERE id = ?
    `;
    const [result] = await db.promise().query(sql, [
        user.user_name, user.email, user.full_name, user.phone, user.address, user.role, user.status, id
    ]);
    return result;
};

const deleteUser = async (id) => {
    const [result] = await db.promise().query("UPDATE users SET status = 'inactive' WHERE id = ?", [id]);
    return result;
};

const updatePasswordByEmail = async (email, hashedPassword) => {
    const [result] = await db.promise().query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);
    return result;
};

module.exports = {
    register,
    findByEmail,
    findById,
    findByUserName,
    login,
    saveOTP,
    verifyOTP,
    updateStatus,
    updateProfile,
    getAllUsers,
    adminUpdateUser,
    deleteUser,
    updatePasswordByEmail
};
