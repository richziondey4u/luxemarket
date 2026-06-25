const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class APIClient {
  async request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
      credentials: "include", // Send cookies automatically
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      // Auto refresh token if expired
      if (res.status === 401 && data.code === "TOKEN_EXPIRED") {
        const refreshed = await this.request("/auth/refresh", {
          method: "POST",
        });
        if (refreshed.success) {
          return this.request(path, options); // Retry original
        }
      }
      throw new Error(data.message || "Request failed");
    }
    return data;
  }

  // Auth
  register = (data) =>
    this.request("/auth/register", { method: "POST", body: data });
  login = (data) => this.request("/auth/login", { method: "POST", body: data });
  logout = () => this.request("/auth/logout", { method: "POST" });
  getMe = () => this.request("/auth/me");

  adminRegister = (data) =>
    this.request("/auth/admin/register", { method: "POST", body: data });
  adminLogin = (data) =>
    this.request("/auth/admin/login", { method: "POST", body: data });

  // Products
  getProducts = (params = {}) =>
    this.request("/products?" + new URLSearchParams(params));
  getProduct = (id) => this.request(`/products/${id}`);
  getCategories = () => this.request("/products/categories");
  addReview = (id, data) =>
    this.request(`/products/${id}/reviews`, { method: "POST", body: data });

  // User
  updateProfile = (data) =>
    this.request("/users/profile", { method: "PUT", body: data });
  updateAddress = (data) =>
    this.request("/users/address", { method: "PUT", body: data });
  changePassword = (data) =>
    this.request("/users/password", { method: "PUT", body: data });

  getWishlist = () => this.request("/users/wishlist");
  toggleWishlist = (id) =>
    this.request(`/users/wishlist/${id}`, { method: "POST" });

  getCart = () => this.request("/users/cart");
  addToCart = (data) =>
    this.request("/users/cart", { method: "POST", body: data });
  updateCartItem = (productId, qty) =>
    this.request(`/users/cart/${productId}`, {
      method: "PUT",
      body: { quantity: qty },
    });
  removeFromCart = (productId) =>
    this.request(`/users/cart/${productId}`, { method: "DELETE" });
  clearCart = () => this.request("/users/cart", { method: "DELETE" });

  // Orders
  createOrder = (data) =>
    this.request("/orders", { method: "POST", body: data });
  getOrders = () => this.request("/orders");
  getOrder = (id) => this.request(`/orders/${id}`);
  cancelOrder = (id) => this.request(`/orders/${id}/cancel`, { method: "PUT" });

  // Payment
  initializePayment = (orderId) =>
    this.request("/payment/initialize", { method: "POST", body: { orderId } });
  verifyPayment = (reference) => this.request(`/payment/verify/${reference}`);

  // Admin
  getDashboard = () => this.request("/admin/dashboard");
  getAnalytics = () => this.request("/admin/analytics");
  getAdminOrders = (params = {}) =>
    this.request("/admin/orders?" + new URLSearchParams(params));
  updateOrderStatus = (id, status) =>
    this.request(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: { status },
    });
  getAdminUsers = (params = {}) =>
    this.request("/admin/users?" + new URLSearchParams(params));
  toggleUserActive = (id) =>
    this.request(`/admin/users/${id}/toggle-active`, { method: "PUT" });
  createProduct = (data) =>
    this.request("/admin/products", { method: "POST", body: data });
  updateProduct = (id, data) =>
    this.request(`/admin/products/${id}`, { method: "PUT", body: data });
  deleteProduct = (id) =>
    this.request(`/admin/products/${id}`, { method: "DELETE" });
  createCategory = (data) =>
    this.request("/admin/categories", { method: "POST", body: data });
}

export const apiClient = new APIClient();
