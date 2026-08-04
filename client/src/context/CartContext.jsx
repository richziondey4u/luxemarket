import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import { apiClient } from "../lib/api.js";

const CartContext = createContext(null);

// Guest cart persistence - only used when NOT logged in, since there's
// no userId to attach a backend cart to. Real accounts always use the
// backend cart via apiClient below.
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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart - from backend if logged in, localStorage if guest
  const loadCart = useCallback(async () => {
    if (authLoading) return;

    if (isAuthenticated) {
      setLoading(true);
      try {
        const res = await apiClient.getCart();
        const normalized = (res.data.items || []).map((item) => ({
          key: item.id, // cart item id
          productId: item.productId,
          quantity: item.quantity,
          product: item.product,
        }));
        setItems(normalized);
      } catch (err) {
        console.error("Failed to load cart:", err);
        // Keep previous items rather than wiping the cart on a transient
        // network error - a failed fetch shouldn't look like an empty cart.
      } finally {
        setLoading(false);
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
            apiClient
              .addToCart({
                productId: String(item.product?.id || item.productId),
                quantity: item.quantity,
              })
              .catch((err) => {
                console.error("Failed to migrate guest cart item:", err);
              }),
          ),
        ).then(() => {
          localStorage.removeItem(LOCAL_KEY);
          loadCart();
        });
      } else {
        loadCart();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const addItem = useCallback(
    async (product, qty = 1) => {
      const productId = String(product.id);

      if (isAuthenticated) {
        try {
          await apiClient.addToCart({ productId, quantity: qty });
          await loadCart();
        } catch (err) {
          console.error("Add to cart failed:", err);
          throw err; // let the UI surface this instead of failing silently
        }
        return;
      }

      // Guest - localStorage
      setItems((prev) => {
        const exists = prev.find(
          (i) => String(i.product?.id || i.productId) === productId,
        );
        const updated = exists
          ? prev.map((i) =>
              String(i.product?.id || i.productId) === productId
                ? { ...i, quantity: i.quantity + qty }
                : i,
            )
          : [...prev, { key: `local_${Date.now()}`, product, quantity: qty }];
        setLocal(updated);
        return updated;
      });
    },
    [isAuthenticated, loadCart],
  );

  const removeItem = useCallback(
    async (productId) => {
      if (isAuthenticated) {
        try {
          await apiClient.removeFromCart(productId);
          await loadCart();
        } catch (err) {
          console.error("Remove from cart failed:", err);
          throw err;
        }
        return;
      }

      setItems((prev) => {
        const updated = prev.filter(
          (i) => String(i.product?.id || i.productId) !== String(productId),
        );
        setLocal(updated);
        return updated;
      });
    },
    [isAuthenticated, loadCart],
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity < 1) {
        return removeItem(productId);
      }

      if (isAuthenticated) {
        try {
          await apiClient.updateCartItem(productId, quantity);
          await loadCart();
        } catch (err) {
          console.error("Update cart quantity failed:", err);
          throw err;
        }
        return;
      }

      setItems((prev) => {
        const updated = prev.map((i) =>
          String(i.product?.id || i.productId) === String(productId)
            ? { ...i, quantity }
            : i,
        );
        setLocal(updated);
        return updated;
      });
    },
    [isAuthenticated, loadCart, removeItem],
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await apiClient.clearCart();
      } catch (err) {
        console.error("Clear cart failed:", err);
      }
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
