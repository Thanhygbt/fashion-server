const nodemailer = require("nodemailer");

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    },
    // Cấu hình timeout dài hơn cho Render
    connectionTimeout: 30000, // 30 giây
    socketTimeout: 30000,     // 30 giây
    greetingTimeout: 30000,
    // Pool connection để tái sử dụng
    pool: {
        maxConnections: 3,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5
    }
});

// Verify config trên startup
const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
if (!emailConfigured) {
    console.warn("[WARNING] Missing EMAIL_USER or EMAIL_PASS environment variables. Email sending will be disabled.");
} else {
    console.log("[INFO] Email credentials configured. EMAIL_USER:", process.env.EMAIL_USER);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hàm gửi email với retry logic
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
    let lastError;

    // Nếu không có email config, không gửi
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("[SKIP] Email not configured. Skipping email send.");
        return { messageId: "DEMO_MODE" };
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[OTP] Attempt ${attempt}/${maxRetries} to send email to ${mailOptions.to}`);
            const result = await transporter.sendMail(mailOptions);
            console.log(`[OTP] Successfully sent OTP email to ${mailOptions.to}`, result.messageId);
            return result;
        } catch (error) {
            lastError = error;

            console.error(`[OTP] Attempt ${attempt} failed:`, {
                code: error.code,
                message: error.message,
                command: error.command,
                responseCode: error.responseCode
            });

            if (attempt < maxRetries) {
                // Chờ trước khi retry (exponential backoff)
                const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                console.log(`[OTP] Retrying in ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    // Format error message based on error code
    let errorMessage = `Failed to send OTP email after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`;

    if (lastError?.code === 'ETIMEDOUT') {
        errorMessage = "Email server connection timeout. Please check network connectivity and try again.";
    } else if (lastError?.code === 'ECONNREFUSED') {
        errorMessage = "Email server connection refused. Please verify SMTP settings.";
    } else if (lastError?.code === 'ENOTFOUND') {
        errorMessage = "Email server not found. Check SMTP host configuration.";
    } else if (lastError?.code === 'EAUTH' || lastError?.message?.includes('Invalid login')) {
        errorMessage = "Email authentication failed. Please verify EMAIL_USER and EMAIL_PASS are correct.";
    } else if (lastError?.responseCode === 535) {
        errorMessage = "Email authentication failed. Incorrect credentials or Gmail App Password required.";
    }

    throw new Error(errorMessage);
}

async function sendOTP(email) {
    const otp = generateOTP();

    // Nếu không có email config, chỉ log OTP và return (demo mode)
    if (!emailConfigured) {
        console.log(`[DEMO MODE] OTP for ${email}: ${otp}`);
        return otp;
    }

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
        console.error("Lỗi gửi mail qua Nodemailer:", error.message);

        // Nếu không phải production, fallback return OTP
        if (process.env.NODE_ENV !== "production") {
            console.warn(`FALLBACK: Returning OTP anyway for testing. OTP for ${email}: ${otp}`);
            return otp;
        }

        // Nếu production, throw error để controller xử lý
        throw error;
    }
}

module.exports = { generateOTP, sendOTP };