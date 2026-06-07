const BASE = "https://dummyjson.com";

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  return res.json();
}

/* ── Categories ── */
export const CATEGORIES = [
  {
    slug: "smartphones",
    label: "Smartphones",
    icon: "📱",
    apiCategory: ["smartphones"],
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  },
  {
    slug: "laptops",
    label: "Laptops",
    icon: "💻",
    apiCategory: ["laptops"],
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  },
  {
    slug: "tablets",
    label: "Tablets",
    icon: "📲",
    apiCategory: ["tablets"],
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
  },
  {
    slug: "fragrances",
    label: "Fragrances",
    icon: "🌸",
    apiCategory: ["fragrances"],
    image:
      "https://images.unsplash.com/photo-1588167056547-c783ed534ee4?w=600&q=80",
  },
  {
    slug: "skincare",
    label: "Skincare",
    icon: "✨",
    apiCategory: ["skin-care"],
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  },
  {
    slug: "groceries",
    label: "Groceries",
    icon: "🛒",
    apiCategory: ["groceries"],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
  },
  {
    slug: "home-decoration",
    label: "Home & Decor",
    icon: "🏠",
    apiCategory: ["home-decoration"],
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  },
  {
    slug: "furniture",
    label: "Furniture",
    icon: "🪑",
    apiCategory: ["furniture"],
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  },
  {
    slug: "fashion",
    label: "Fashion",
    icon: "👕",
    // Merges ALL clothing categories
    apiCategory: [
      "tops",
      "womens-dresses",
      "mens-shirts",
      "womens-tops",
      "mens-jackets",
      "womens-jackets",
    ],
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
  },
  {
    slug: "shoes",
    label: "Shoes",
    icon: "👟",
    apiCategory: ["mens-shoes", "womens-shoes"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
  {
    slug: "watches",
    label: "Watches",
    icon: "⌚",
    apiCategory: ["mens-watches", "womens-watches"],
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
  {
    slug: "bags",
    label: "Bags",
    icon: "👜",
    apiCategory: ["womens-bags"],
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  },
  {
    slug: "jewellery",
    label: "Jewellery",
    icon: "💍",
    apiCategory: ["womens-jewellery"],
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
  },
  {
    slug: "sunglasses",
    label: "Sunglasses",
    icon: "🕶️",
    apiCategory: ["sunglasses"],
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
  },
  {
    slug: "sports",
    label: "Sports",
    icon: "⚽",
    apiCategory: ["sports-accessories"],
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
  },
  {
    slug: "vehicle",
    label: "Automotive",
    icon: "🚗",
    apiCategory: ["vehicle", "motorcycle"],
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
  },
  {
    slug: "lighting",
    label: "Lighting",
    icon: "💡",
    apiCategory: ["lighting"],
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
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

/* ── Fetch all sub-categories and merge ── */
async function fetchMerged(apiCategories, limit = 100) {
  // Fetch all in parallel
  const results = await Promise.allSettled(
    apiCategories.map((cat) =>
      get(`${BASE}/products/category/${cat}?limit=100`)
        .then((d) => d.products || [])
        .catch(() => []),
    ),
  );
  const all = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Deduplicate by id
  const seen = new Set();
  const unique = all.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return {
    products: unique.slice(0, limit),
    total: unique.length,
  };
}

export const api = {
  getFeaturedProducts: (limit = 20) =>
    get(`${BASE}/products?limit=${limit}&skip=0`).then((d) => d.products),

  getProductsByCategory: async (slug, limit = 100) => {
    const cat = getCategoryBySlug(slug);
    if (!cat) return { products: [], total: 0 };
    const cats = Array.isArray(cat.apiCategory)
      ? cat.apiCategory
      : [cat.apiCategory];
    return fetchMerged(cats, limit);
  },

  getProduct: (id) => get(`${BASE}/products/${id}`),

  searchProducts: (q, limit = 30) =>
    get(
      `${BASE}/products/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    ).then((d) => d.products),

  getNewArrivals: () =>
    get(`${BASE}/products?limit=20&skip=20`).then((d) => d.products),

  getBestSellers: () =>
    get(`${BASE}/products?limit=20&skip=5`).then((d) => d.products),

  getRelatedProducts: async (slug, excludeId) => {
    const cat = getCategoryBySlug(slug);
    if (!cat) return [];
    const cats = Array.isArray(cat.apiCategory)
      ? cat.apiCategory
      : [cat.apiCategory];
    const data = await fetchMerged(cats, 20);
    return data.products.filter((p) => p.id !== Number(excludeId)).slice(0, 6);
  },

  getAllProducts: (limit = 100, skip = 0) =>
    get(`${BASE}/products?limit=${limit}&skip=${skip}`),
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
