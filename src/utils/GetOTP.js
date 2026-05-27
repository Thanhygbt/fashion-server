const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const resendApiKey = process.env.RESEND_API_KEY;

const smtpConfigured = !!(emailUser && emailPass);
const resendConfigured = !!resendApiKey;
const mailConfigured = smtpConfigured || resendConfigured;

let transporter;
let resendClient;

// ================= SMTP (fallback) =================
if (smtpConfigured) {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPass
        },
        family: 4,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        tls: {
            rejectUnauthorized: false
        }
    });

    console.log("[OTP] SMTP ready:", emailUser);
}

// ================= RESEND (primary) =================
if (resendConfigured) {
    resendClient = new Resend(resendApiKey);
    console.log("[OTP] Resend ready");
}

if (!mailConfigured) {
    console.warn("[OTP WARNING] No email provider configured (demo mode)");
}

// ================= OTP =================
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= SEND CORE =================
async function sendEmailWithRetry(mailOptions, maxRetries = 2) {
    let lastError;

    if (!mailConfigured) {
        console.warn("[OTP] Skipping email (no provider)");
        return { messageId: "FALLBACK_MODE" };
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[OTP] Attempt ${attempt}/${maxRetries} -> ${mailOptions.to}`);

            // 👉 ưu tiên Gmail SMTP (để mail thật đến inbox)
            if (smtpConfigured && transporter) {
                const result = await transporter.sendMail({
                    from: `"LMN Fashion" <${emailUser}>`,
                    to: mailOptions.to,
                    subject: mailOptions.subject,
                    html: mailOptions.html
                });

                return { messageId: result?.messageId || "smtp" };
            }

            // 👉 fallback Resend
            if (resendConfigured && resendClient) {
                const result = await resendClient.emails.send({
                    from: process.env.RESEND_FROM || "LMN Fashion <onboarding@resend.dev>",
                    to: mailOptions.to,
                    subject: mailOptions.subject,
                    html: mailOptions.html
                });

                return { messageId: result?.id || "resend" };
            }

            const result = await transporter.sendMail({
                from: `"LMN Fashion" <${emailUser}>`,
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.html
            });

            return { messageId: result?.messageId || "smtp" };

        } catch (error) {
            lastError = error;
            console.error("[OTP ERROR]", error.message);

            if (attempt < maxRetries) {
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    return {
        messageId: "FAILED_BUT_CONTINUED",
        error: lastError?.message || "unknown error"
    };
}

async function sendOTP(email) {
    const otp = generateOTP();

    if (!mailConfigured) {
        console.log(`[DEMO MODE] OTP for ${email}: ${otp}`);
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
        `
    };

    const result = await sendEmailWithRetry(mailOptions);

    if (result.messageId === "FALLBACK_MODE" || result.messageId === "FAILED_BUT_CONTINUED") {
        console.log(`[FALLBACK] OTP for ${email}: ${otp}`);
        return otp;
    }

    console.log(`[OTP SENT] ${email} (messageId=${result.messageId})`);
    return otp;
}

module.exports = { generateOTP, sendOTP };