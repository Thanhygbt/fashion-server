const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const smtpConfigured = !!(emailUser && emailPass);

let transporter;
if (smtpConfigured) {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // STARTTLS
        auth: {
            user: emailUser,
            pass: emailPass
        },
        connectionTimeout: 10000, // 10s để kết nối
        greetingTimeout: 10000,   // 10s để nhận greeting
        socketTimeout: 15000,     // 15s idle timeout
        tls: {
            rejectUnauthorized: false
        }
    });
    console.log("[INFO] SMTP (Gmail) Transporter configured for user:", emailUser);
} else {
    console.warn("[WARNING] Missing EMAIL_USER or EMAIL_PASS. Email sending disabled.");
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmailWithRetry(mailOptions, maxRetries = 2) {
    let lastError;

    if (!smtpConfigured) {
        console.warn("[SKIP] SMTP not configured. Returning fallback mode.");
        return { messageId: "FALLBACK_MODE", error: "SMTP configuration not found" };
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[OTP] Attempt ${attempt}/${maxRetries} to send email to ${mailOptions.to}`);
            const result = await transporter.sendMail({
                from: `"LMN Fashion" <${emailUser}>`,
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.html
            });
            console.log(`[OTP] Successfully sent OTP email to ${mailOptions.to}`, result?.messageId || "unknown");
            return { messageId: result?.messageId || "smtp" };
        } catch (error) {
            lastError = error;
            console.error(`[OTP] Attempt ${attempt} failed:`, {
                code: error.code,
                message: error.message,
                name: error.name
            });

            if (attempt < maxRetries) {
                const delayMs = 2000;
                console.log(`[OTP] Retrying in ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    const errorMessage = `Failed to send OTP email after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`;
    console.warn(`[OTP] Falling back: ${errorMessage}`);
    return { messageId: "FALLBACK_MODE", error: errorMessage };
}

async function sendOTP(email) {
    const otp = generateOTP();

    if (!smtpConfigured) {
        console.log(`[DEMO MODE] SMTP not configured. OTP for ${email}: ${otp}`);
        return otp;
    }

    const mailOptions = {
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

    const result = await sendEmailWithRetry(mailOptions);

    if (result.messageId === "FALLBACK_MODE" || result.messageId === "FAILED_BUT_CONTINUED") {
        console.log(`[FALLBACK] OTP for ${email}: ${otp} - Email send failed, returning OTP for testing`);
        return otp;
    }

    console.log(`OTP sent via Gmail SMTP to ${email}: ${otp}`);
    return otp;
}

module.exports = { generateOTP, sendOTP };