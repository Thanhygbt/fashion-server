const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";
const resendConfigured = !!process.env.RESEND_API_KEY;

if (!resendConfigured) {
    console.warn("[WARNING] Missing RESEND_API_KEY. Email sending will be disabled.");
} else {
    console.log("[INFO] Resend configured. RESEND_FROM:", resendFrom);
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("vi-VN") + " VNĐ";
}

// Hàm gửi email với retry logic - fallback gracefully khi fail
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
    let lastError;

    if (!resendConfigured) {
        console.warn("[SKIP] Resend not configured. Skipping email send to:", mailOptions.to);
        return { messageId: "DEMO_MODE" };
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Email] Attempt ${attempt}/${maxRetries} to send email to ${mailOptions.to}`);
            const result = await resend.emails.send({
                from: resendFrom,
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.html
            });
            console.log(`[Email] Successfully sent email to ${mailOptions.to}`, result?.data?.id || "unknown");
            return { messageId: result?.data?.id || "resend" };
        } catch (error) {
            lastError = error;
            console.error(`[Email] Attempt ${attempt} failed:`, {
                code: error.code,
                message: error.message,
                name: error.name,
                statusCode: error.statusCode
            });

            if (attempt < maxRetries) {
                const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                console.log(`[Email] Retrying in ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    const errorMessage = `Failed to send email after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`;

    console.error("[Email] Final error after all retries:", errorMessage);
    // Fallback: không throw error, cho phép quy trình tiếp tục
    return { messageId: "FAILED_BUT_CONTINUED", error: errorMessage };
}

async function sendOrderConfirmationEmail({ toEmail, customerName, orderId, items, totalAmount, address, phone, paymentMethod }) {
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
                            <td style="color: #888; padding: 4px 0;">Mã đơn hàng</td>
                            <td style="text-align: right; font-weight: 700; color: #000;">#LMN-${orderIdStr}</td>
                        </tr>
                        <tr>
                            <td style="color: #888; padding: 4px 0;">Phương thức</td>
                            <td style="text-align: right; font-weight: 600;">${methodLabel}</td>
                        </tr>
                        <tr>
                            <td style="color: #888; padding: 4px 0;">Giao tới</td>
                            <td style="text-align: right;">${address || "—"}</td>
                        </tr>
                        <tr>
                            <td style="color: #888; padding: 4px 0;">Số điện thoại</td>
                            <td style="text-align: right;">${phone || "—"}</td>
                        </tr>
                    </table>
                </div>
                <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 24px;">
                    <thead>
                        <tr style="background: #000; color: #fff; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
                            <th style="padding: 12px 10px; text-align: left;">Sản phẩm</th>
                            <th style="padding: 12px 10px; text-align: center;">SL</th>
                            <th style="padding: 12px 10px; text-align: right;">Đơn giá</th>
                            <th style="padding: 12px 10px; text-align: right;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <div style="text-align: right; margin-bottom: 40px;">
                    <span style="font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Tổng cộng: </span>
                    <span style="font-size: 22px; font-weight: 900; color: #000;">${formatCurrency(totalAmount)}</span>
                </div>
                <p style="font-size: 13px; color: #666; line-height: 1.7; border-top: 1px solid #eee; padding-top: 24px;">
                    Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể. Nếu có thắc mắc, vui lòng liên hệ
                    <a href="mailto:support@lmnfashion.com" style="color: #000;">support@lmnfashion.com</a>.
                </p>
            </div>
            <div style="background: #f5f5f5; padding: 24px 48px; text-align: center; font-size: 11px; color: #999; letter-spacing: 1px; text-transform: uppercase;">
                © 2026 LMN Fashion — Minimalist Essence Since 2024
            </div>
        </div>
    `;

    await sendEmailWithRetry({
        from: resendFrom,
        to: toEmail,
        subject: `[LMN Fashion] Đơn hàng #LMN-${orderIdStr} đã được xác nhận`,
        html,
    });

    console.log(`Order confirmation email sent to ${toEmail} for order #${orderId}`);
}

module.exports = { sendOrderConfirmationEmail };
