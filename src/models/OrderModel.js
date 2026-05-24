const { db } = require("../configs/Database");

function calculateDiscount(coupon, subtotal) {
    if (!coupon) {
        return 0;
    }

    if (coupon.discount_type === "percent") {
        return Math.min(subtotal, (subtotal * Number(coupon.discount_value)) / 100);
    }

    return Math.min(subtotal, Number(coupon.discount_value));
}

async function restockOrderItems(connection, orderId) {
    const [itemRows] = await connection.query(
        "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
        [orderId]
    );

    if (itemRows.length === 0) {
        return;
    }

    for (const item of itemRows) {
        await connection.query(
            "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
            [item.quantity, item.product_id]
        );
    }

    const logRows = itemRows.map((item) => [
        item.product_id,
        orderId,
        item.quantity,
        "order_cancelled"
    ]);

    await connection.query(
        "INSERT INTO inventory_logs (product_id, order_id, change_amount, reason) VALUES ?",
        [logRows]
    );
}

async function releaseCouponUsage(connection, couponCode) {
    if (!couponCode) {
        return;
    }

    await connection.query(
        "UPDATE coupons SET used_count = CASE WHEN used_count > 0 THEN used_count - 1 ELSE 0 END WHERE code = ?",
        [couponCode]
    );
}

const createOrder = async (orderData) => {
    const { userId, address, phone, items, couponCode, paymentMethod, simulatePaymentSuccess } = orderData;
    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        const productIds = items.map((item) => item.productId);
        const [productRows] = await connection.query(
            "SELECT * FROM products WHERE id IN (?) FOR UPDATE",
            [productIds]
        );

        if (productRows.length !== productIds.length) {
            throw new Error("One or more products do not exist");
        }

        const productsById = new Map(productRows.map((product) => [product.id, product]));
        let subtotal = 0;

        for (const item of items) {
            const product = productsById.get(item.productId);

            if (!product) {
                throw new Error(`Product ${item.productId} does not exist`);
            }

            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new Error("Invalid item quantity");
            }

            if (product.stock_quantity < item.quantity) {
                throw new Error(`${product.name} is out of stock`);
            }

            subtotal += Number(product.price) * item.quantity;
        }

        let coupon = null;
        if (couponCode) {
            const [couponRows] = await connection.query(
                "SELECT * FROM coupons WHERE code = ? FOR UPDATE",
                [couponCode]
            );

            if (couponRows.length === 0) {
                throw new Error("Coupon not found");
            }

            coupon = couponRows[0];
            const now = new Date();

            if (!coupon.is_active) {
                throw new Error("Coupon is inactive");
            }

            if (coupon.expires_at && new Date(coupon.expires_at) < now) {
                throw new Error("Coupon has expired");
            }

            if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
                throw new Error("Coupon usage limit reached");
            }

            if (subtotal < Number(coupon.min_order_amount)) {
                throw new Error("Order does not meet the coupon minimum");
            }
        }

        const discountAmount = calculateDiscount(coupon, subtotal);
        const totalAmount = Math.max(0, subtotal - discountAmount);
        const normalizedPaymentMethod = paymentMethod || "cod";

        let paymentStatus = "pending";
        let orderStatus = "pending";

        if (normalizedPaymentMethod !== "cod") {
            throw new Error("Only COD payment is supported");
        }

        const orderSql = `
            INSERT INTO orders
            (user_id, total_amount, status, address, phone, coupon_code, discount_amount, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [orderResult] = await connection.query(orderSql, [
            userId, totalAmount, orderStatus, address, phone, coupon ? coupon.code : null, discountAmount, paymentStatus
        ]);

        const orderId = orderResult.insertId;
        const itemValues = items.map((item) => {
            const product = productsById.get(item.productId);
            return [orderId, item.productId, item.quantity, product.price, item.size || "Default"];
        });

        await connection.query(
            "INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES ?",
            [itemValues]
        );

        for (const item of items) {
            await connection.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                [item.quantity, item.productId]
            );
        }

        const inventoryRows = items.map((item) => [
            item.productId,
            orderId,
            -item.quantity,
            "order_created"
        ]);

        await connection.query(
            "INSERT INTO inventory_logs (product_id, order_id, change_amount, reason) VALUES ?",
            [inventoryRows]
        );

        if (coupon) {
            await connection.query(
                "UPDATE coupons SET used_count = used_count + 1 WHERE id = ?",
                [coupon.id]
            );
        }

        await connection.commit();
        
        return {
            orderId,
            subtotal,
            discountAmount,
            totalAmount,
            orderStatus,
            paymentStatus,
            items: items.map(item => ({
                name: productsById.get(item.productId).name,
                quantity: item.quantity,
                price: Number(productsById.get(item.productId).price)
            }))
        };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

const getOrders = async (viewer, filters) => {
    const conditions = [];
    const params = [];

    if (viewer.role !== "admin") {
        conditions.push("o.user_id = ?");
        params.push(viewer.id);
    } else if (filters.userId) {
        conditions.push("o.user_id = ?");
        params.push(filters.userId);
    }

    if (filters.status) {
        conditions.push("o.status = ?");
        params.push(filters.status);
    }

    let sql = `
        SELECT o.*
        FROM orders o
    `;

    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += " ORDER BY o.created_at DESC";

    const [results] = await db.promise().query(sql, params);
    return results;
};

const getOrderById = async (orderId) => {
    const [orderResults] = await db.promise().query("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (orderResults.length === 0) return null;

    const order = orderResults[0];
    const sqlItems = `
        SELECT oi.*, p.name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `;

    const [itemResults] = await db.promise().query(sqlItems, [orderId]);
    order.items = itemResults;
    return order;
};

const updateOrderStatus = async (orderId, nextStatus, actor) => {
    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        const [orderRows] = await connection.query(
            "SELECT * FROM orders WHERE id = ? FOR UPDATE",
            [orderId]
        );

        if (orderRows.length === 0) {
            throw new Error("Order not found");
        }

        const order = orderRows[0];
        if (actor.role !== "admin" && order.user_id !== actor.id) {
            throw new Error("Forbidden");
        }

        if (nextStatus === "cancelled") {
            if (order.status === "completed" || order.payment_status === "paid") {
                throw new Error("Cannot cancel paid or completed order");
            }

            if (order.status !== "cancelled") {
                await restockOrderItems(connection, orderId);
                await releaseCouponUsage(connection, order.coupon_code);
            }
        }

        await connection.query(
            "UPDATE orders SET status = ? WHERE id = ?",
            [nextStatus, orderId]
        );

        await connection.commit();
        return { orderId, status: nextStatus };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

const hasPurchasedProduct = async (userId, productId) => {
    const sql = `
        SELECT 1
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE o.user_id = ?
          AND oi.product_id = ?
          AND o.status = 'completed'
        LIMIT 1
    `;

    const [results] = await db.promise().query(sql, [userId, productId]);
    return results.length > 0;
};

const deletePendingOrder = async (orderId) => {
    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        const [orderRows] = await connection.query(
            `SELECT o.*
             FROM orders o
             WHERE o.id = ?
             FOR UPDATE`,
            [orderId]
        );

        if (orderRows.length === 0) throw new Error("Order not found");

        const order = orderRows[0];
        if (order.payment_status === "paid") {
            throw new Error("Order already paid");
        }

        if (order.status !== "cancelled") {
            await restockOrderItems(connection, orderId);
            await releaseCouponUsage(connection, order.coupon_code);
        }

        await connection.query("DELETE FROM inventory_logs WHERE order_id = ?", [orderId]);
        await connection.query("DELETE FROM order_items WHERE order_id = ?", [orderId]);
        await connection.query("DELETE FROM orders WHERE id = ?", [orderId]);

        await connection.commit();
        return { orderId, deleted: true };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    hasPurchasedProduct,
    deletePendingOrder
};
