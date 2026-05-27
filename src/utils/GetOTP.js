const nodemailer = require("nodemailer");

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
    // Tăng timeout để tránh lỗi connection timeout trên Render
    connectionTimeout: 10000, // 10 giây
    socketTimeout: 10000,     // 10 giây
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hàm gửi email với retry logic
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[OTP] Attempt ${attempt}/${maxRetries} to send email to ${mailOptions.to}`);
            const result = await transporter.sendMail(mailOptions);
            console.log(`[OTP] Successfully sent OTP email to ${mailOptions.to}`, result.messageId);
            return result;
        } catch (error) {
            lastError = error;
            console.error(`[OTP] Attempt ${attempt} failed:`, error.message);

            if (attempt < maxRetries) {
                // Chờ trước khi retry (exponential backoff)
                const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                console.log(`[OTP] Retrying in ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    throw new Error(`Failed to send OTP email after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

async function sendOTP(email) {
    const otp = generateOTP();

    const mailOptions = {
        from: `"LMN FASHION" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Mã Xác Thực OTP - LMN FASHION",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Mã Xác Thực OTP</h2>
                <p>Chào bạn,</p>
                <p>Mã OTP để hoàn tất đăng kí tài khoản của bạn là:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #007bff; border-radius: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>Mã này sẽ hết hạn trong 5 phút. Vui lòng không chia sẻ mã này với bất kì ai.</p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #777; text-align: center;">Đây là email tự động từ LMN Fashion.</p>
            </div>
        `,
    };

    try {
        await sendEmailWithRetry(mailOptions);
        console.log(`OTP sent via Nodemailer to ${email}: ${otp}`);
        return otp;
    } catch (error) {
        console.error("Lỗi gửi mail qua Nodemailer:", error);
        // In production we propagate the error so callers can handle it as a failure.
        // In development (or when NODE_ENV !== 'production') we fallback: log the OTP
        // and return it so the flow can continue for testing without valid mail creds.
        if (process.env.NODE_ENV === "production") {
            throw error;
        }

        console.warn(`FALLBACK: nodemailer failed, returning generated OTP for ${email}:`, otp);
        return otp;
    }
}

module.exports = { generateOTP, sendOTP };