import { prisma } from "../lib/prisma.js";
import { config } from "../config/config.js";

/* ── Initialize Paystack payment ── */
export const initializePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user.id },
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    if (order.status !== "PENDING") {
      return res
        .status(400)
        .json({ success: false, message: "Order already processed." });
    }

    const amountInKobo = Math.round(order.total * config.usdToNgn * 100);

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.paystack.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: order.email,
          amount: amountInKobo,
          currency: "NGN",
          reference: `LM-${order.orderNumber}-${Date.now()}`,
          callback_url: `${config.frontendUrl}/payment/verify`,
          metadata: {
            orderId: order.id,
            userId: req.user.id,
            orderNumber: order.orderNumber,
          },
        }),
      },
    );

    const data = await response.json();
    if (!data.status) {
      return res
        .status(400)
        .json({
          success: false,
          message: data.message || "Payment initialization failed.",
        });
    }

    // Save pending payment
    await prisma.payment.upsert({
      where: { orderId: order.id },
      update: { reference: data.data.reference, status: "PENDING" },
      create: {
        orderId: order.id,
        reference: data.data.reference,
        amount: order.total * config.usdToNgn,
        status: "PENDING",
        gateway: "paystack",
      },
    });

    res.json({
      success: true,
      data: {
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
        accessCode: data.data.access_code,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Verify Paystack payment ── */
export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    // Verify with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${config.paystack.secretKey}` },
      },
    );

    const data = await response.json();
    if (!data.status || data.data.status !== "success") {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed." });
    }

    const { orderId } = data.data.metadata;

    // Update in transaction
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { reference },
        data: { status: "SUCCESS", gatewayData: data.data },
      });
      await tx.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });
    });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payment: true },
    });

    res.json({ success: true, message: "Payment verified!", data: { order } });
  } catch (err) {
    next(err);
  }
};

/* ── Paystack Webhook ── */
export const paystackWebhook = async (req, res, next) => {
  try {
    // Verify webhook signature
    const crypto = await import("crypto");
    const hash = crypto
      .createHmac("sha512", config.paystack.secretKey)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature." });
    }

    const { event, data } = req.body;

    if (event === "charge.success") {
      const { reference, metadata } = data;
      const { orderId } = metadata || {};

      if (orderId) {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { reference },
            data: { status: "SUCCESS", gatewayData: data },
          });
          await tx.order.update({
            where: { id: orderId },
            data: { status: "PAID" },
          });
        });
      }
    }

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
