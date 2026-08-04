import { prisma } from "../lib/prisma.js";

export const createOrder = async (req, res, next) => {
  console.log("🔥 createOrder called");
  try {
    const { items, shippingAddress, notes } = req.body;
    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zip,
      country,
    } = shippingAddress;

    if (!items?.length)
      return res
        .status(400)
        .json({ success: false, message: "Order must have items." });

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "One or more products not found." });
    }

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for ${product.title}`);
      const price = product.price * (1 - product.discountPercentage / 100);
      return {
        productId: product.id,
        title: product.title,
        price,
        quantity: item.quantity,
        thumbnail: product.thumbnail,
      };
    });

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.075;
    const total = subtotal + shipping + tax;

    // ── THE KEY FIX: req.user.id is correctly bound to the order ──
    const order = await prisma.$transaction(async (tx) => {
      await Promise.all(
        orderItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id, // ← this links order to the logged-in user
          firstName,
          lastName,
          email,
          phone,
          street,
          city,
          state,
          zip,
          country: country || "Nigeria",
          subtotal,
          shipping,
          tax,
          total,
          notes,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { userId: req.user.id } });
      return newOrder;
    });

    res
      .status(201)
      .json({ success: true, message: "Order created!", data: { order } });
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
              },
            },
          },
        },
        payment: true,
      },
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    res.json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Please check your order number.",
      });
    }

    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true },
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    if (!["PENDING", "PAID"].includes(order.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel at this stage." });
    }
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
      await Promise.all(
        order.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          }),
        ),
      );
    });
    res.json({ success: true, message: "Order cancelled." });
  } catch (err) {
    next(err);
  }
};
