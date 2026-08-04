const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function getDB(path, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${API}${path}`, {
      credentials: "include",
      signal: controller.signal,
      ...opts,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Error ${res.status}`);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") throw new Error("Request timed out");
    throw err;
  }
}

export const api = {
  getCategories: () =>
    getDB("/products/categories").then((d) => d.data?.categories || []),

  getFeaturedProducts: (limit = 20) =>
    getDB(`/products?limit=${limit}&sort=createdAt&order=desc`).then(
      (d) => d.data?.products || [],
    ),

  getProductsByCategory: async (slug, limit = 100) => {
    const d = await getDB(
      `/products?limit=${limit}&category=${encodeURIComponent(slug)}`,
    );
    return {
      products: d.data?.products || [],
      total: d.data?.pagination?.total || 0,
    };
  },

  getProduct: async (id) => {
    const d = await getDB(`/products/${id}`);
    const product = d.data?.product;
    if (!product) throw new Error("Product not found");
    return product;
  },

  searchProducts: (q, limit = 30) =>
    getDB(`/products?search=${encodeURIComponent(q)}&limit=${limit}`).then(
      (d) => d.data?.products || [],
    ),

  getNewArrivals: () =>
    getDB("/products?limit=20&sort=createdAt&order=desc").then(
      (d) => d.data?.products || [],
    ),

  getBestSellers: () =>
    getDB("/products?limit=20&featured=true").then(
      (d) => d.data?.products || [],
    ),

  getRelatedProducts: async (slug, excludeId) => {
    const d = await getDB(
      `/products?limit=8&category=${encodeURIComponent(slug)}`,
    );
    return (d.data?.products || [])
      .filter((p) => String(p.id) !== String(excludeId))
      .slice(0, 6);
  },
};


export const formatPrice = (n) => {
  const num = Number(n);

  if (isNaN(num)) return "₦0";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};
export const discountedPrice = (price, pct) => {
  const p = Number(price) || 0;
  const d = Number(pct) || 0;
  return p * (1 - d / 100);
};
