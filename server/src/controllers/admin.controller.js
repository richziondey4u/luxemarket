import { prisma } from "../lib/prisma.js";

/* ── Dashboard stats ── */
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
          user: { select: { name: true, email: true } },
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

/* ── Get all orders ── */
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
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
          user: { select: { name: true, email: true, avatar: true } },
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

/* ── Update order status ── */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "PENDING",
      "PAID",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ];

    if (!validStatuses.includes(status?.toUpperCase())) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
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

/* ── Get all users ── */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      role: "USER",
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

/* ── Toggle user active ── */
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
      select: { id: true, isActive: true, name: true },
    });

    res.json({
      success: true,
      message: `${user.name} has been ${user.isActive ? "activated" : "deactivated"}.`,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Create product — saves to PostgreSQL ── */
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      discountPercentage,
      stock,
      brand,
      thumbnail,
      images,
      tags,
      categoryId,
      isFeatured,
    } = req.body;

    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Product title is required." });
    if (!price || isNaN(Number(price)))
      return res
        .status(400)
        .json({ success: false, message: "Valid price is required." });

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description || "",
        price: Number(price),
        discountPercentage: Number(discountPercentage) || 0,
        stock: Number(stock) || 0,
        brand: brand || "",
        thumbnail: thumbnail || "",
        images: Array.isArray(images) ? images : [],
        tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
        isFeatured: Boolean(isFeatured),
        isActive: true,
        rating: 0,
        reviewCount: 0,
        ...(categoryId && { categoryId }),
      },
      include: { category: true },
    });

    console.log(`✅ Product created: ${product.title} (ID: ${product.id})`);

    res.status(201).json({
      success: true,
      message: `Product "${product.title}" created successfully!`,
      data: { product },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Update product ── */
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
      brand,
      thumbnail,
      images,
      tags,
      categoryId,
      isFeatured,
      isActive,
    } = req.body;

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
        ...(brand !== undefined && { brand }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(images !== undefined && { images }),
        ...(tags !== undefined && {
          tags: Array.isArray(tags) ? tags : [tags],
        }),
        ...(categoryId !== undefined && { categoryId }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      include: { category: true },
    });

    res.json({ success: true, message: "Product updated!", data: { product } });
  } catch (err) {
    next(err);
  }
};

/* ── Delete product (soft delete) ── */
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

/* ── Get all products (admin view — includes inactive) ── */
export const getAdminProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { category: { name: { contains: search, mode: "insensitive" } } },
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

/* ── Analytics ── */
export const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      thisMonthRevenue,
      lastMonthRevenue,
      thisMonthOrders,
      lastMonthOrders,
      ordersByStatus,
      topProducts,
    ] = await Promise.all([
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

    res.json({
      success: true,
      data: {
        thisMonthRevenue: thisMonthRevenue._sum.total || 0,
        lastMonthRevenue: lastMonthRevenue._sum.total || 0,
        revenueGrowth: lastMonthRevenue._sum.total
          ? (
              (((thisMonthRevenue._sum.total || 0) -
                lastMonthRevenue._sum.total) /
                lastMonthRevenue._sum.total) *
              100
            ).toFixed(1)
          : null,
        thisMonthOrders,
        lastMonthOrders,
        ordersByStatus,
        topProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Create category ── */
export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, icon, description, image } = req.body;
    if (!name || !slug)
      return res
        .status(400)
        .json({ success: false, message: "Name and slug are required." });

    const category = await prisma.category.create({
      data: { name: name.trim(), slug: slug.trim(), icon, description, image },
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Category created!",
        data: { category },
      });
  } catch (err) {
    next(err);
  }
};
