import { prisma } from "../lib/prisma.js";

/* ── Get all products — DB first, then note DummyJSON is external ── */
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sort = "createdAt",
      order = "desc",
      minPrice,
      maxPrice,
      featured,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(featured && { isFeatured: featured === "true" }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: Number(minPrice) }),
          ...(maxPrice && { lte: Number(maxPrice) }),
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const validSorts = ["createdAt", "price", "rating", "title"];
    const sortField = validSorts.includes(sort) ? sort : "createdAt";
    const sortOrder = order === "asc" ? "asc" : "desc";

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { [sortField]: sortOrder },
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

/* ── Get single product by DB id ── */
export const getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, isActive: true },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    res.json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

/* ── Get categories from DB ── */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data: { categories } });
  } catch (err) {
    next(err);
  }
};

/* ── Add review ── */
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { id: productId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });

    const review = await prisma.review.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: { rating: Number(rating), comment: comment || "" },
      create: {
        userId: req.user.id,
        productId,
        rating: Number(rating),
        comment: comment || "",
        name: req.user.name,
      },
    });

    // Recalculate product rating
    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round((stats._avg.rating || 0) * 10) / 10,
        reviewCount: stats._count.rating,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Review submitted!", data: { review } });
  } catch (err) {
    next(err);
  }
};
