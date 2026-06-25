const DUMMY = "https://dummyjson.com";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ── Fetch helpers ── */
async function getDB(path) {
  const res = await fetch(`${API}${path}`, { credentials: "include" });
  if (!res.ok) throw new Error(`DB API error: ${res.status}`);
  return res.json();
}

async function getDummy(path) {
  const res = await fetch(`${DUMMY}${path}`);
  if (!res.ok) throw new Error(`DummyJSON error: ${res.status}`);
  return res.json();
}

export const CATEGORIES = [
  {
    slug: "smartphones",
    label: "Smartphones",
    icon: "📱",
    apiCategory: ["smartphones"],
  },
  { slug: "laptops", label: "Laptops", icon: "💻", apiCategory: ["laptops"] },
  { slug: "tablets", label: "Tablets", icon: "📲", apiCategory: ["tablets"] },
  {
    slug: "fragrances",
    label: "Fragrances",
    icon: "🌸",
    apiCategory: ["fragrances"],
  },
  {
    slug: "skincare",
    label: "Skincare",
    icon: "✨",
    apiCategory: ["skin-care"],
  },
  {
    slug: "groceries",
    label: "Groceries",
    icon: "🛒",
    apiCategory: ["groceries"],
  },
  {
    slug: "home-decoration",
    label: "Home & Decor",
    icon: "🏠",
    apiCategory: ["home-decoration"],
  },
  {
    slug: "furniture",
    label: "Furniture",
    icon: "🪑",
    apiCategory: ["furniture"],
  },
  {
    slug: "fashion",
    label: "Fashion",
    icon: "👕",
    apiCategory: [
      "tops",
      "womens-dresses",
      "mens-shirts",
      "womens-tops",
      "mens-jackets",
      "womens-jackets",
    ],
  },
  {
    slug: "shoes",
    label: "Shoes",
    icon: "👟",
    apiCategory: ["mens-shoes", "womens-shoes"],
  },
  {
    slug: "watches",
    label: "Watches",
    icon: "⌚",
    apiCategory: ["mens-watches", "womens-watches"],
  },
  { slug: "bags", label: "Bags", icon: "👜", apiCategory: ["womens-bags"] },
  {
    slug: "jewellery",
    label: "Jewellery",
    icon: "💍",
    apiCategory: ["womens-jewellery"],
  },
  {
    slug: "sunglasses",
    label: "Sunglasses",
    icon: "🕶️",
    apiCategory: ["sunglasses"],
  },
  {
    slug: "sports",
    label: "Sports",
    icon: "⚽",
    apiCategory: ["sports-accessories"],
  },
  {
    slug: "vehicle",
    label: "Automotive",
    icon: "🚗",
    apiCategory: ["vehicle", "motorcycle"],
  },
  {
    slug: "lighting",
    label: "Lighting",
    icon: "💡",
    apiCategory: ["lighting"],
  },
];

export const getCategoryBySlug = (slug) =>
  CATEGORIES.find(
    (c) =>
      c.slug === slug ||
      (Array.isArray(c.apiCategory)
        ? c.apiCategory.includes(slug)
        : c.apiCategory === slug),
  );

/* ── Merge helper — DB products first, no duplicates ── */
function mergeProducts(dbProds, dummyProds) {
  const dbIds = new Set(dbProds.map((p) => String(p.id)));
  return [...dbProds, ...dummyProds.filter((p) => !dbIds.has(String(p.id)))];
}

/* ── Fetch DummyJSON category ── */
async function fetchDummyCategory(apiCategories) {
  const results = await Promise.allSettled(
    apiCategories.map((cat) =>
      getDummy(`/products/category/${cat}?limit=100`)
        .then((d) => d.products || [])
        .catch(() => []),
    ),
  );
  const all = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);
  const seen = new Set();
  return all.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export const api = {
  /* ── Featured: DB products + DummyJSON ── */
  getFeaturedProducts: async (limit = 20) => {
    const [dbData, dummyData] = await Promise.allSettled([
      getDB("/products?limit=100&sort=createdAt&order=desc").then(
        (d) => d.data?.products || [],
      ),
      getDummy(`/products?limit=${limit}&skip=0`).then((d) => d.products || []),
    ]);
    const db = dbData.status === "fulfilled" ? dbData.value : [];
    const dummy = dummyData.status === "fulfilled" ? dummyData.value : [];
    return mergeProducts(db, dummy).slice(0, limit + db.length);
  },

  /* ── By category: DB + DummyJSON ── */
  getProductsByCategory: async (slug, limit = 100) => {
    const cat = getCategoryBySlug(slug);

    // Get DB products for this category
    const dbPromise = getDB(`/products?limit=100&category=${slug}`)
      .then((d) => d.data?.products || [])
      .catch(() => []);

    // Get DummyJSON products
    const dummyPromise = cat
      ? fetchDummyCategory(
          Array.isArray(cat.apiCategory) ? cat.apiCategory : [cat.apiCategory],
        )
      : Promise.resolve([]);

    const [dbProds, dummyProds] = await Promise.all([dbPromise, dummyPromise]);
    const merged = mergeProducts(dbProds, dummyProds);

    return { products: merged.slice(0, limit), total: merged.length };
  },

  /* ── Single product: try DB first, fall back to DummyJSON ── */
  getProduct: async (id) => {
    const strId = String(id);

    // DB products have UUID format (contains hyphens, long string)
    // DummyJSON products have small numeric IDs (1-194)
    const isNumeric = /^\d+$/.test(strId);
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        strId,
      );

    if (isUUID) {
      // Must be a DB product
      const d = await getDB(`/products/${strId}`);
      return d.data.product;
    }

    if (isNumeric) {
      // Must be a DummyJSON product
      return getDummy(`/products/${strId}`);
    }

    throw new Error("Invalid product ID");
  },

  /* ── Search: DB + DummyJSON ── */
  searchProducts: async (q, limit = 30) => {
    const [dbData, dummyData] = await Promise.allSettled([
      getDB(`/products?search=${encodeURIComponent(q)}&limit=50`).then(
        (d) => d.data?.products || [],
      ),
      getDummy(
        `/products/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      ).then((d) => d.products || []),
    ]);
    const db = dbData.status === "fulfilled" ? dbData.value : [];
    const dummy = dummyData.status === "fulfilled" ? dummyData.value : [];
    return mergeProducts(db, dummy).slice(0, limit);
  },

  /* ── New arrivals: DB new products + DummyJSON ── */
  getNewArrivals: async () => {
    const [dbData, dummyData] = await Promise.allSettled([
      getDB("/products?limit=10&sort=createdAt&order=desc").then(
        (d) => d.data?.products || [],
      ),
      getDummy("/products?limit=20&skip=20").then((d) => d.products || []),
    ]);
    const db = dbData.status === "fulfilled" ? dbData.value : [];
    const dummy = dummyData.status === "fulfilled" ? dummyData.value : [];
    return mergeProducts(db, dummy);
  },

  /* ── Best sellers: DB featured + DummyJSON ── */
  getBestSellers: async () => {
    const [dbData, dummyData] = await Promise.allSettled([
      getDB("/products?limit=10&featured=true").then(
        (d) => d.data?.products || [],
      ),
      getDummy("/products?limit=20&skip=5").then((d) => d.products || []),
    ]);
    const db = dbData.status === "fulfilled" ? dbData.value : [];
    const dummy = dummyData.status === "fulfilled" ? dummyData.value : [];
    return mergeProducts(db, dummy);
  },

  /* ── Related products ── */
  getRelatedProducts: async (slug, excludeId) => {
    const cat = getCategoryBySlug(slug);
    const excludeStr = String(excludeId);

    const dbPromise = getDB(`/products?category=${slug}&limit=20`)
      .then((d) =>
        (d.data?.products || []).filter((p) => String(p.id) !== excludeStr),
      )
      .catch(() => []);

    const dummyPromise = cat
      ? fetchDummyCategory(
          Array.isArray(cat.apiCategory) ? cat.apiCategory : [cat.apiCategory],
        ).then((prods) => prods.filter((p) => String(p.id) !== excludeStr))
      : Promise.resolve([]);

    const [dbProds, dummyProds] = await Promise.all([dbPromise, dummyPromise]);
    return mergeProducts(dbProds, dummyProds).slice(0, 6);
  },
};

/* ── Helpers ── */
const USD_TO_NGN = 1600;

export const formatPrice = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round((n || 0) * USD_TO_NGN));

export const discountedPrice = (price, pct) =>
  (price || 0) * (1 - (pct || 0) / 100);
