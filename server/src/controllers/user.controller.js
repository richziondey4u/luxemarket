import argon2 from "argon2";
import { prisma } from "../lib/prisma.js";

/* ── Update profile ── */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });
    res.json({ success: true, message: "Profile updated!", data: { user } });
  } catch (err) {
    next(err);
  }
};

/* ── Update address ── */
export const updateAddress = async (req, res, next) => {
  try {
    const { street, city, state, zip, country } = req.body;
    const address = await prisma.address.upsert({
      where: { userId: req.user.id },
      update: { street, city, state, zip, country },
      create: { userId: req.user.id, street, city, state, zip, country },
    });
    res.json({ success: true, message: "Address updated!", data: { address } });
  } catch (err) {
    next(err);
  }
};

/* ── Change password ── */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const valid = await argon2.verify(user.password, currentPassword);
    if (!valid) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    }

    const hashed = await argon2.hash(newPassword, { type: argon2.argon2id });
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId: req.user.id } });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Password changed. Please log in again.",
    });
  } catch (err) {
    next(err);
  }
};

/* ── Get wishlist ── */
export const getWishlist = async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: { items } });
  } catch (err) {
    next(err);
  }
};

/* ── Toggle wishlist ── */
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });
    if (existing) {
      await prisma.wishlistItem.delete({
        where: { userId_productId: { userId: req.user.id, productId } },
      });
      return res.json({
        success: true,
        message: "Removed from wishlist",
        data: { wishlisted: false },
      });
    }
    await prisma.wishlistItem.create({
      data: { userId: req.user.id, productId },
    });
    res.json({
      success: true,
      message: "Added to wishlist",
      data: { wishlisted: true },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Get cart ── */
export const getCart = async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            discountPercentage: true,
            thumbnail: true,
            stock: true,
            brand: true,
          },
        },
      },
    });
    const subtotal = items.reduce(
      (s, i) =>
        s +
        i.product.price * (1 - i.product.discountPercentage / 100) * i.quantity,
      0,
    );
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.075;
    res.json({
      success: true,
      data: {
        items,
        subtotal,
        shipping,
        tax,
        total: subtotal + shipping + tax,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Add to cart ── */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stock." });
    }

    const item = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId: req.user.id, productId, quantity },
      include: { product: true },
    });
    res.json({ success: true, message: "Added to cart!", data: { item } });
  } catch (err) {
    next(err);
  }
};

/* ── Update cart item ── */
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) {
      await prisma.cartItem.delete({
        where: { userId_productId: { userId: req.user.id, productId } },
      });
      return res.json({ success: true, message: "Item removed from cart." });
    }
    const item = await prisma.cartItem.update({
      where: { userId_productId: { userId: req.user.id, productId } },
      data: { quantity },
      include: { product: true },
    });
    res.json({ success: true, data: { item } });
  } catch (err) {
    next(err);
  }
};

/* ── Remove from cart ── */
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await prisma.cartItem.delete({
      where: { userId_productId: { userId: req.user.id, productId } },
    });
    res.json({ success: true, message: "Removed from cart." });
  } catch (err) {
    next(err);
  }
};

/* ── Clear cart ── */
export const clearCart = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json({ success: true, message: "Cart cleared." });
  } catch (err) {
    next(err);
  }
};
