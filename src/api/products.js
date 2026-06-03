/**
 * All API calls live here.
 * When your backend is ready, just replace the fetch URLs.
 * Each function has a comment showing the REST endpoint it maps to.
 */

const BASE = "https://dummyjson.com";

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  return res.json();
}

// ─── Category map ────────────────────────────────────────────────────────────
export const CATEGORIES = [
  {
    slug: "smartphones",
    label: "Smartphones",
    icon: "📱",
    color: "from-blue-600 to-indigo-700",
    apiCategory: "smartphones",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  },
  {
    slug: "laptops",
    label: "Laptops",
    icon: "💻",
    color: "from-slate-600 to-slate-800",
    apiCategory: "laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  },
  {
    slug: "fragrances",
    label: "Fragrances",
    icon: "🌸",
    color: "from-pink-500 to-rose-600",
    apiCategory: "fragrances",
    image:
      "https://images.unsplash.com/photo-1588167056547-c783ed534ee4?w=600&q=80",
  },
  {
    slug: "skincare",
    label: "Skincare",
    icon: "✨",
    color: "from-emerald-500 to-teal-600",
    apiCategory: "skincare",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  },
  {
    slug: "groceries",
    label: "Groceries",
    icon: "🛒",
    color: "from-green-500 to-lime-600",
    apiCategory: "groceries",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
  },
  {
    slug: "home-decoration",
    label: "Home & Decor",
    icon: "🏠",
    color: "from-amber-500 to-orange-600",
    apiCategory: "home-decoration",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  },
  {
    slug: "furniture",
    label: "Furniture",
    icon: "🪑",
    color: "from-stone-500 to-stone-700",
    apiCategory: "furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  },
  {
    slug: "tops",
    label: "Fashion",
    icon: "👕",
    color: "from-violet-500 to-purple-700",
    apiCategory: "tops",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
  },
  {
    slug: "sports-accessories",
    label: "Sports",
    icon: "⚽",
    color: "from-red-500 to-rose-700",
    apiCategory: "sports-accessories",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
  },
  {
    slug: "vehicle",
    label: "Automotive",
    icon: "🚗",
    color: "from-gray-600 to-gray-800",
    apiCategory: "vehicle",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
  },
];

export const getCategoryBySlug = (slug) =>
  CATEGORIES.find((c) => c.slug === slug);

// ─── API functions ───────────────────────────────────────────────────────────
// Replace BASE and paths with your own backend when ready

export const api = {
  // GET /api/products?limit=n
  getFeaturedProducts: (limit = 12) =>
    get(`${BASE}/products?limit=${limit}&skip=0`).then((d) => d.products),

  // GET /api/products?category=slug&limit=n&skip=n
  getProductsByCategory: (slug, limit = 30, skip = 0) => {
    const cat = CATEGORIES.find((c) => c.slug === slug)?.apiCategory || slug;
    return get(`${BASE}/products/category/${cat}?limit=${limit}&skip=${skip}`);
  },

  // GET /api/products/:id
  getProduct: (id) => get(`${BASE}/products/${id}`),

  // GET /api/products/search?q=query
  searchProducts: (q, limit = 20) =>
    get(
      `${BASE}/products/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    ).then((d) => d.products),

  // GET /api/products?sort=createdAt&order=desc&limit=8
  getNewArrivals: () =>
    get(`${BASE}/products?limit=8&skip=20`).then((d) => d.products),

  // GET /api/products?sort=sales&order=desc&limit=8
  getBestSellers: () =>
    get(`${BASE}/products?limit=8&skip=5`).then((d) => d.products),

  // GET /api/products?category=slug&exclude=id&limit=4
  getRelatedProducts: (slug, excludeId) => {
    const cat = CATEGORIES.find((c) => c.slug === slug)?.apiCategory || slug;
    return get(`${BASE}/products/category/${cat}?limit=8`).then((d) =>
      d.products.filter((p) => p.id !== Number(excludeId)).slice(0, 4),
    );
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
// 1 USD ≈ 1,600 NGN — swap this rate with a live rate from your backend later
const USD_TO_NGN = 1600;

export const formatPrice = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n * USD_TO_NGN));

export const discountedPrice = (price, pct) => price * (1 - pct / 100);
