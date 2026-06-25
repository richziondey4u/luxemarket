import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Local storage cart for guests
const LOCAL_KEY = "lm_cart_guest";
const getLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
};
const setLocal = (items) =>
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));

export function CartProvider({ children }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart — from backend if logged in, localStorage if guest
  const loadCart = useCallback(async () => {
    if (authLoading) return;
    if (isAuthenticated) {
      try {
        const d = await apiFetch("/users/cart");
        // Normalize backend cart items to match frontend shape
        const normalized = (d.data.items || []).map((item) => ({
          key: item.id,
          quantity: item.quantity,
          product: item.product,
        }));
        setItems(normalized);
      } catch {
        setItems([]);
      }
    } else {
      setItems(getLocal());
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Migrate guest cart to backend on login
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const guestCart = getLocal();
      if (guestCart.length > 0) {
        Promise.all(
          guestCart.map((item) =>
            apiFetch("/users/cart", {
              method: "POST",
              body: {
                productId: String(item.product?.id || item.productId),
                quantity: item.quantity,
              },
            }).catch(() => {}),
          ),
        ).then(() => {
          localStorage.removeItem(LOCAL_KEY);
          loadCart();
        });
      } else {
        loadCart();
      }
    }
  }, [isAuthenticated, authLoading]);

  const addItem = useCallback(
    async (product, qty = 1) => {
      if (isAuthenticated) {
        try {
          // For custom products (not in backend DB), store locally with user tag
          if (String(product.id).startsWith("custom_")) {
            const existing = items.find(
              (i) => String(i.product?.id) === String(product.id),
            );
            if (existing) {
              setItems((prev) =>
                prev.map((i) =>
                  String(i.product?.id) === String(product.id)
                    ? { ...i, quantity: i.quantity + qty }
                    : i,
                ),
              );
            } else {
              setItems((prev) => [
                ...prev,
                { key: `cart_${Date.now()}`, product, quantity: qty },
              ]);
            }
            return;
          }
          await apiFetch("/users/cart", {
            method: "POST",
            body: { productId: String(product.id), quantity: qty },
          });
          await loadCart();
        } catch (err) {
          console.error("Add to cart failed:", err);
        }
      } else {
        // Guest cart
        setItems((prev) => {
          const exists = prev.find(
            (i) => String(i.product?.id || i.productId) === String(product.id),
          );
          const updated = exists
            ? prev.map((i) =>
                String(i.product?.id || i.productId) === String(product.id)
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              )
            : [...prev, { key: `local_${Date.now()}`, product, quantity: qty }];
          setLocal(updated);
          return updated;
        });
      }
    },
    [isAuthenticated, items, loadCart],
  );

  const removeItem = useCallback(
    async (productId) => {
      if (isAuthenticated && !String(productId).startsWith("custom_")) {
        try {
          await apiFetch(`/users/cart/${productId}`, { method: "DELETE" });
          await loadCart();
        } catch {}
      } else {
        setItems((prev) => {
          const updated = prev.filter(
            (i) => String(i.product?.id || i.productId) !== String(productId),
          );
          if (!isAuthenticated) setLocal(updated);
          return updated;
        });
      }
    },
    [isAuthenticated, loadCart],
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity < 1) {
        removeItem(productId);
        return;
      }
      if (isAuthenticated && !String(productId).startsWith("custom_")) {
        try {
          await apiFetch(`/users/cart/${productId}`, {
            method: "PUT",
            body: { quantity },
          });
          await loadCart();
        } catch {}
      } else {
        setItems((prev) => {
          const updated = prev.map((i) =>
            String(i.product?.id || i.productId) === String(productId)
              ? { ...i, quantity }
              : i,
          );
          if (!isAuthenticated) setLocal(updated);
          return updated;
        });
      }
    },
    [isAuthenticated, loadCart, removeItem],
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await apiFetch("/users/cart", { method: "DELETE" });
      } catch {}
    } else {
      localStorage.removeItem(LOCAL_KEY);
    }
    setItems([]);
  }, [isAuthenticated]);

  // Computed values
  const subtotal = items.reduce((s, i) => {
    const p = i.product || {};
    const price = p.price * (1 - (p.discountPercentage || 0) / 100);
    return s + price * i.quantity;
  }, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.075;
  const total = subtotal + shipping + tax;
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        totalItems,
        subtotal,
        shipping,
        tax,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        reload: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
