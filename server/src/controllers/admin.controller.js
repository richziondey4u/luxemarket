import { prisma } from "../lib/prisma.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      revenue,
      pendingOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.aggregate({
        where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, avatar: true } },
          items: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          totalUsers,
          totalProducts,
          totalRevenue: revenue._sum.total || 0,
          pendingOrders,
        },
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [tmr, lmr, tmo, lmo, byStatus, topProducts] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: thisMonth },
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: lastMonth, lt: thisMonth },
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: thisMonth } } }),
      prisma.order.count({
        where: { createdAt: { gte: lastMonth, lt: thisMonth } },
      }),
      prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.orderItem.groupBy({
        by: ["productId", "title"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

    const t = tmr._sum.total || 0;
    const l = lmr._sum.total || 0;

    res.json({
      success: true,
      data: {
        thisMonthRevenue: t,
        lastMonthRevenue: l,
        revenueGrowth: l > 0 ? (((t - l) / l) * 100).toFixed(1) : null,
        thisMonthOrders: tmo,
        lastMonthOrders: lmo,
        ordersByStatus: byStatus,
        topProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Orders: ALL orders, from ALL users, visible to admin ── */
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(status && status !== "all" && { status: status.toUpperCase() }),
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          items: true,
          payment: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = [
      "PENDING",
      "PAID",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ];
    if (!valid.includes(status?.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${valid.join(", ")}`,
      });
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: status.toUpperCase() },
    });
    res.json({
      success: true,
      message: `Order updated to ${status}`,
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        payment: true,
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Delete payment first (if exists)
    if (order.payment) {
      await prisma.payment.delete({
        where: { orderId: id },
      });
    }

    // Delete order items
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Delete order
    await prisma.order.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 100, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const toggleUserActive = async (req, res, next) => {
  try {
    const existing = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: !existing.isActive },
      select: { id: true, name: true, isActive: true },
    });
    res.json({
      success: true,
      message: `${user.name} ${user.isActive ? "activated" : "deactivated"}.`,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = {
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
        ],
      }),
    };
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      discountPercentage,
      stock,
      rating,
      reviewCount,
      brand,
      thumbnail,
      images,
      tags,
      categoryId,
      isFeatured,
    } = req.body;

    if (!title?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    if (!price || Number(price) <= 0)
      return res
        .status(400)
        .json({ success: false, message: "Valid price is required." });
    if (!categoryId)
      return res
        .status(400)
        .json({ success: false, message: "Category is required." });

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Invalid category." });

    const processedTags = Array.isArray(tags)
      ? tags.filter(Boolean)
      : tags
        ? String(tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
    const processedImages = Array.isArray(images)
      ? images.filter(Boolean)
      : thumbnail
        ? [thumbnail]
        : [];

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description?.trim() || "",
        price: Number(price),
        discountPercentage: Number(discountPercentage) || 0,
        stock: Number(stock) || 0,

        rating: Number(rating) || 0,
        reviewCount: Number(reviewCount) || 0,

        brand: brand?.trim() || "",
        thumbnail: thumbnail || "",
        images: processedImages,
        tags: processedTags,
        isFeatured: Boolean(isFeatured),
        isActive: true,
        categoryId,
      },
      include: { category: true },
    });

    res.status(201).json({
      success: true,
      message: `"${product.title}" added!`,
      data: { product },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });

    const {
      title,
      description,
      price,
      discountPercentage,
      stock,
      rating,
      reviewCount,
      brand,
      thumbnail,
      images,
      tags,
      categoryId,
      isFeatured,
      isActive,
    } = req.body;

    if (categoryId) {
      const cat = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!cat)
        return res
          .status(400)
          .json({ success: false, message: "Invalid category." });
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(discountPercentage !== undefined && {
          discountPercentage: Number(discountPercentage),
        }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(rating !== undefined && {
          rating: Number(rating),
        }),
        ...(reviewCount !== undefined && {
          reviewCount: Number(reviewCount),
        }),
        ...(brand !== undefined && { brand }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(images !== undefined && {
          images: Array.isArray(images) ? images : [images].filter(Boolean),
        }),
        ...(tags !== undefined && {
          tags: Array.isArray(tags)
            ? tags.filter(Boolean)
            : String(tags)
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
        }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: { category: true },
    });

    res.json({ success: true, message: "Product updated!", data: { product } });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    await prisma.product.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ success: true, message: "Product deleted." });
  } catch (err) {
    next(err);
  }
};

/* ── Category management ── */
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data: { categories } });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, icon, description, image } = req.body;
    if (!name?.trim() || !slug?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Name and slug are required." });
    }
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        icon,
        description,
        image,
      },
    });
    res.status(201).json({
      success: true,
      message: "Category created!",
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, icon, description, image, isActive } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(icon !== undefined && { icon }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    res.json({
      success: true,
      message: "Category updated!",
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const productCount = await prisma.product.count({
      where: { categoryId: req.params.id },
    });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${productCount} product(s) use this category.`,
      });
    }
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Category deleted." });
  } catch (err) {
    next(err);
  }
};
