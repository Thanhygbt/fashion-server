const orderModel = require("../models/OrderModel");
const userModel = require("../models/UserModel");
const { sendOrderConfirmationEmail } = require("../utils/EmailService");

const createOrderService = async (user, data) => {
    if (!Array.isArray(data.items) || data.items.length === 0 || !data.address || !data.phone) {
        return { success: false, statusCode: 400, message: "Missing order information" };
    }

    const normalizedItems = data.items.map((item) => ({
        productId: Number(item.productId || item.id),
        quantity: Number(item.quantity),
        size: item.size || null
    }));

    if (normalizedItems.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
        return { success: false, statusCode: 400, message: "Invalid order items" };
    }

    const paymentMethod = data.paymentMethod || "cod";
    if (paymentMethod !== "cod") {
        return { success: false, statusCode: 400, message: "Only COD payment is supported" };
    }

    try {
        const result = await orderModel.createOrder({
            userId: user.id,
            address: data.address,
            phone: data.phone,
            items: normalizedItems,
            couponCode: data.couponCode || null,
            paymentMethod,
            simulatePaymentSuccess: data.simulatePaymentSuccess
        });

        try {
            const userInfo = await userModel.findById(user.id);
            if (userInfo && userInfo.email) {
                sendOrderConfirmationEmail({
                    toEmail: userInfo.email,
                    customerName: userInfo.full_name || userInfo.user_name,
                    orderId: result.orderId,
                    items: result.items,
                    totalAmount: result.totalAmount,
                    address: data.address,
                    phone: data.phone,
                    paymentMethod: paymentMethod
                }).catch(e => console.error("COD email error:", e.message));
            }
        } catch (e) {}

        return { success: true, statusCode: 201, message: "Order created", order: result };
    } catch (err) {
        console.error("Create Order Error:", err);
        const statusCode = err.message.includes("Coupon")
            || err.message.includes("stock")
            || err.message.includes("quantity")
            || err.message.includes("products do not exist")
            || err.message.includes("does not exist")
            || err.message.includes("minimum")
            ? 400
            : 500;
        return { success: false, statusCode, message: err.message || "Server error" };
    }
};

const getOrdersService = async (user, filters) => {
    try {
        const results = await orderModel.getOrders(user, filters);
        return { success: true, statusCode: 200, data: results };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error", detail: err.message };
    }
};

const getOrderByIdService = async (user, orderId) => {
    try {
        const order = await orderModel.getOrderById(orderId);
        if (!order) return { success: false, statusCode: 404, message: "Order not found" };

        if (user.role !== "admin" && order.user_id !== user.id) {
            return { success: false, statusCode: 403, message: "Forbidden" };
        }

        return { success: true, statusCode: 200, data: order };
    } catch (err) {
        return { success: false, statusCode: 500, message: "Server error" };
    }
};

const triggerOrderEmailService = async (user, orderId) => {
    try {
        const order = await orderModel.getOrderById(orderId);
        if (!order) return { success: false, statusCode: 404, message: "Order not found" };
        if (user.role !== "admin" && order.user_id !== user.id) return { success: false, statusCode: 403, message: "Forbidden" };

        const userInfo = await userModel.findById(order.user_id);
        if (!userInfo || !userInfo.email) {
            return { success: false, statusCode: 500, message: "Cannot find user email" };
        }

        await sendOrderConfirmationEmail({
            toEmail: userInfo.email,
            customerName: userInfo.full_name || userInfo.user_name,
            orderId: Number(orderId),
            items: order.items || [],
            totalAmount: order.total_amount,
            address: order.address,
            phone: order.phone,
            paymentMethod: "cod"
        });
        return { success: true, statusCode: 200, message: "Email sent" };
    } catch (err) {
        return { success: false, statusCode: 500, message: err.message || "Email send failed" };
    }
};

const cancelPendingOrderService = async (user, orderId) => {
    try {
        const order = await orderModel.getOrderById(orderId);
        if (!order) return { success: false, statusCode: 404, message: "Order not found" };
        if (user.role !== "admin" && order.user_id !== user.id) return { success: false, statusCode: 403, message: "Forbidden" };

        const result = await orderModel.deletePendingOrder(orderId);
        return { success: true, statusCode: 200, message: "Order cancelled", order: result };
    } catch (err) {
        const statusCode = err.message === "Order not found" ? 404 : err.message === "Order already paid" ? 409 : 500;
        return { success: false, statusCode, message: err.message };
    }
};

const updateOrderStatusService = async (user, orderId, data) => {
    const allowedStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!allowedStatuses.includes(data.status)) {
        return { success: false, statusCode: 400, message: "Invalid status" };
    }

    try {
        const result = await orderModel.updateOrderStatus(orderId, data.status, user);
        return { success: true, statusCode: 200, message: "Order status updated", order: result };
    } catch (err) {
        const statusCode = err.message === "Order not found"
            ? 404
            : err.message === "Forbidden"
                ? 403
                : err.message.includes("Cannot")
                    ? 409
                    : 500;
        return { success: false, statusCode, message: err.message };
    }
};

module.exports = {
    createOrderService,
    getOrdersService,
    getOrderByIdService,
    triggerOrderEmailService,
    cancelPendingOrderService,
    updateOrderStatusService
};
