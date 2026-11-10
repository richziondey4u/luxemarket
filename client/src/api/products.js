const API = "https://dummyjson.com";

async function getDB(path) {
  const res = await fetch(`${API}${path}`);

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  getCategories: async () => {
    return getDB("/products/category-list");
  },

  getFeaturedProducts: async (limit = 20) => {
    const d = await getDB(`/products?limit=${limit}`);
    return d.products || [];
  },

  getProductsByCategory: async (slug, limit = 100) => {
    const d = await getDB(
      `/products/category/${encodeURIComponent(slug)}?limit=${limit}`,
    );

    return {
      products: d.products || [],
      total: d.total || 0,
    };
  },

  getProduct: async (id) => {
    const d = await getDB(`/products/${id}`);

    if (!d.id) throw new Error("Product not found");

    return d;
  },

  searchProducts: async (q, limit = 30) => {
    const d = await getDB(
      `/products/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    );

    return d.products || [];
  },

  getNewArrivals: async () => {
    const d = await getDB("/products?sortBy=id&order=desc&limit=20");
    return d.products || [];
  },

  getBestSellers: async () => {
    const d = await getDB("/products?sortBy=rating&order=desc&limit=20");
    return d.products || [];
  },

  getRelatedProducts: async (slug, excludeId) => {
    const d = await getDB(
      `/products/category/${encodeURIComponent(slug)}?limit=20`,
    );

    return (d.products || [])
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
