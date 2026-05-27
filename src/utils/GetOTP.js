const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";
const resendConfigured = !!process.env.RESEND_API_KEY;

if (!resendConfigured) {
    console.warn("[WARNING] Missing RESEND_API_KEY. Email sending will be disabled.");
} else {
    console.log("[INFO] Resend configured. RESEND_FROM:", resendFrom);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hàm gửi email với retry logic
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
    let lastError;

    if (!resendConfigured) {
        console.warn("[SKIP] Resend not configured. Returning fallback mode.");
        return { messageId: "FALLBACK_MODE", error: "RESEND_API_KEY not configured" };
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[OTP] Attempt ${attempt}/${maxRetries} to send email to ${mailOptions.to}`);
            const result = await resend.emails.send({
                from: resendFrom,
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.html
            });
            console.log(`[OTP] Successfully sent OTP email to ${mailOptions.to}`, result?.data?.id || "unknown");
            return { messageId: result?.data?.id || "resend" };
        } catch (error) {
            lastError = error;

            console.error(`[OTP] Attempt ${attempt} failed:`, {
                code: error.code,
                message: error.message,
                name: error.name,
                statusCode: error.statusCode
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

    console.log(`OTP sent via Nodemailer to ${email}: ${otp}`);
    return otp;
}

module.exports = { generateOTP, sendOTP };