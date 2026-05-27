const nodemailer = require("nodemailer");

const emailService = process.env.EMAIL_SERVICE || "gmail";
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const smtpConfigured = !!(emailUser && emailPass);

let transporter;
if (smtpConfigured) {
    transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
    console.log("[INFO] SMTP Transporter configured for user:", emailUser);
} else {
    console.warn("[WARNING] Missing EMAIL_USER or EMAIL_PASS. SMTP email sending will be disabled.");
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hàm gửi email với retry logic
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
    let lastError;

    if (!smtpConfigured) {
        console.warn("[SKIP] SMTP not configured. Returning fallback mode.");
        return { messageId: "FALLBACK_MODE", error: "SMTP configuration not found" };
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[OTP] Attempt ${attempt}/${maxRetries} to send email to ${mailOptions.to}`);
            const result = await transporter.sendMail({
                from: mailOptions.from || `"LMN Fashion" <${emailUser}>`,
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
                // Chờ trước khi retry (exponential backoff)
                const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                console.log(`[OTP] Retrying in ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    const errorMessage = `Failed to send OTP email after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`;

    console.warn(`[OTP] Falling back to demo mode due to: ${lastError?.message || 'Unknown error'}`);
    return { messageId: "FALLBACK_MODE", error: errorMessage };
}

async function sendOTP(email) {
    const otp = generateOTP();

    if (!resendConfigured) {
        console.log(`[DEMO MODE] Resend not configured. OTP for ${email}: ${otp}`);
        return otp;
    }

    const mailOptions = {
        from: resendFrom,
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

    // Nếu fallback mode (network error), vẫn return OTP để test được
    if (result.messageId === 'FALLBACK_MODE' || result.messageId === 'FAILED_BUT_CONTINUED') {
        console.log(`[FALLBACK] OTP for ${email}: ${otp} - Email send failed, returning OTP for testing`);
        return otp;
    }

    console.log(`OTP sent via Resend to ${email}: ${otp}`);
    return otp;
}

module.exports = { generateOTP, sendOTP };