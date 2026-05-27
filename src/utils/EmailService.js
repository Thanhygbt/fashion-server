const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const resendApiKey = process.env.RESEND_API_KEY;

const smtpConfigured = !!(emailUser && emailPass);
const resendConfigured = !!resendApiKey;

let transporter;
let resendClient;

// ================= SMTP =================
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

    console.log("[INFO] SMTP (Gmail) Transporter configured for user:", emailUser);
}

// ================= RESEND =================
if (resendConfigured) {
    resendClient = new Resend(resendApiKey);
    console.log("[INFO] Resend client configured");
}

const mailConfigured = smtpConfigured || resendConfigured;

// ================= RETRY CORE =================
async function sendEmailWithRetry(mailOptions, maxRetries = 2) {
    let lastError;

    if (!mailConfigured) {
        console.warn("[SKIP] No email provider configured");
        return { messageId: "NO_PROVIDER" };
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Email] Attempt ${attempt}/${maxRetries} -> ${mailOptions.to}`);


            if (smtpConfigured && transporter) {
                const res = await transporter.sendMail({
                    from: `"LMN Fashion" <${emailUser}>`,
                    to: mailOptions.to,
                    subject: mailOptions.subject,
                    html: mailOptions.html
                });

                console.log("[Email] Sent via SMTP:", res?.messageId);
                return { messageId: res?.messageId || "smtp" };
            }

            if (resendConfigured && resendClient) {
                const res = await resendClient.emails.send({
                    from: process.env.RESEND_FROM || "LMN Fashion <onboarding@resend.dev>",
                    to: mailOptions.to,
                    subject: mailOptions.subject,
                    html: mailOptions.html
                });

                console.log("[Email] Sent via Resend:", res?.id);
                return { messageId: res?.id || "resend" };
            }

            const res = await transporter.sendMail({
                from: `"LMN Fashion" <${emailUser}>`,
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.html
            });

            console.log("[Email] Sent via SMTP:", res?.messageId);
            return { messageId: res?.messageId || "smtp" };

        } catch (error) {
            lastError = error;
            console.error(`[Email] Attempt ${attempt} failed:`, error.message);

            if (attempt < maxRetries) {
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    return {
        messageId: "FAILED_BUT_CONTINUED",
        error: lastError?.message || "Unknown error"
    };
}

// ================= FORMAT =================
function formatCurrency(value) {
    return Number(value || 0).toLocaleString("vi-VN") + " VNĐ";
}


async function sendOrderConfirmationEmail({
    toEmail,
    customerName,
    orderId,
    items,
    totalAmount,
    address,
    phone,
    paymentMethod
}) {
    const methodLabel = "Thanh toan khi nhan hang (COD)";

    const itemsHtml = (items || []).map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}${item.size ? ` (Size: ${item.size})` : ""}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>
    `).join("");

    const orderIdStr = String(orderId).padStart(5, "0");


    const html = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 640px; margin: auto; background: #fff; color: #111;">
            <div style="background: #000; padding: 40px 48px; text-align: center;">
                <h1 style="color: #fff; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: 900;">LMN</h1>
                <p style="color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 8px 0 0;">FASHION</p>
            </div>
            <div style="padding: 48px;">
                <h2 style="font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Đặt Hàng Thành Công</h2>
                <p style="color: #666; font-size: 14px; margin: 0 0 32px;">
                    Xin chào <strong>${customerName || "Quý khách"}</strong>, cảm ơn bạn đã tin tưởng mua sắm tại LMN Fashion.
                </p>

                <div style="background: #f9f9f9; padding: 20px 24px; border-left: 3px solid #000; margin-bottom: 32px;">
                    <table style="width: 100%; font-size: 14px;">
                        <tr>
                            <td style="color: #888;">Mã đơn hàng</td>
                            <td style="text-align: right; font-weight: 700;">#LMN-${orderIdStr}</td>
                        </tr>
                        <tr>
                            <td style="color: #888;">Phương thức</td>
                            <td style="text-align: right;">${methodLabel}</td>
                        </tr>
                        <tr>
                            <td style="color: #888;">Giao tới</td>
                            <td style="text-align: right;">${address || "—"}</td>
                        </tr>
                        <tr>
                            <td style="color: #888;">Số điện thoại</td>
                            <td style="text-align: right;">${phone || "—"}</td>
                        </tr>
                    </table>
                </div>

                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background: #000; color: #fff;">
                            <th style="padding: 12px;">Sản phẩm</th>
                            <th style="padding: 12px;">SL</th>
                            <th style="padding: 12px;">Đơn giá</th>
                            <th style="padding: 12px;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div style="text-align: right; margin-top: 30px;">
                    <span style="font-size: 13px;">Tổng cộng:</span>
                    <span style="font-size: 22px; font-weight: 900;">
                        ${formatCurrency(totalAmount)}
                    </span>
                </div>

                <p style="margin-top: 30px; font-size: 13px; color: #666;">
                    Chúng tôi sẽ xử lý đơn hàng sớm nhất. Liên hệ:
                    <a href="mailto:support@lmnfashion.com">support@lmnfashion.com</a>
                </p>
            </div>

            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 11px;">
                © 2026 LMN Fashion
            </div>
        </div>
    `;

    await sendEmailWithRetry({
        to: toEmail,
        subject: `[LMN Fashion] Đơn hàng #LMN-${orderIdStr} đã được xác nhận`,
        html,
    });

    console.log(`[OK] Order email sent -> ${toEmail} (#LMN-${orderIdStr})`);
}

module.exports = { sendOrderConfirmationEmail };