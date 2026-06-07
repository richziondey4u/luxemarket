import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Star,
  Package,
} from "lucide-react";
import { useFeaturedProducts } from "../../hooks/useProducts.js";
import {
  formatPrice,
  discountedPrice,
  CATEGORIES,
} from "../../api/products.js";
import { truncate } from "../../lib/utils.js";
import toast from "react-hot-toast";

const CUSTOM_KEY = "lm_custom_products";
const getCustom = () => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveCustom = (p) => localStorage.setItem(CUSTOM_KEY, JSON.stringify(p));

const EMPTY_PRODUCT = {
  id: "",
  title: "",
  description: "",
  price: "",
  discountPercentage: 0,
  rating: 4.5,
  stock: 10,
  brand: "",
  category: "smartphones",
  thumbnail: "",
  tags: "",
};

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const set = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Product title is required");
      return;
    }
    if (!form.price || isNaN(form.price) || +form.price <= 0) {
      toast.error("Valid price is required");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    const saved = {
      ...form,
      id: form.id || "custom_" + Date.now(),
      price: +form.price,
      discountPercentage: +form.discountPercentage || 0,
      stock: +form.stock || 0,
      rating: +form.rating || 4.5,
      thumbnail:
        form.thumbnail ||
        `https://placehold.co/400x400/4f7d52/white?text=${encodeURIComponent(form.title.slice(0, 8))}`,
      images: form.thumbnail ? [form.thumbnail] : [],
      isCustom: true,
    };
    onSave(saved);
    setSaving(false);
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "#f9fafb",
    border: "1.5px solid #e5e7eb",
    color: "#111827",
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "0.82rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #a3c4a5",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package
                style={{ width: "15px", height: "15px", color: "#4f7d52" }}
              />
            </div>
            <h2
              style={{
                fontSize: "0.95rem",
                fontWeight: "800",
                color: "#111827",
                margin: 0,
              }}
            >
              {form.id ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              display: "flex",
              padding: "4px",
            }}
          >
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSave}
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div>
            <label style={labelStyle}>Product Title *</label>
            <input
              value={form.title}
              onChange={set("title")}
              required
              placeholder="e.g. Premium Wireless Earbuds"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Describe the product..."
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
              gap: "12px",
            }}
          >
            <div>
              <label style={labelStyle}>Price (USD) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={set("price")}
                required
                placeholder="29.99"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
              {form.price && (
                <p
                  style={{
                    fontSize: "0.68rem",
                    color: "#4f7d52",
                    marginTop: "3px",
                  }}
                >
                  ≈ {formatPrice(+form.price)}
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Discount %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.discountPercentage}
                onChange={set("discountPercentage")}
                placeholder="0"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div>
              <label style={labelStyle}>Stock Qty</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={set("stock")}
                placeholder="10"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div>
              <label style={labelStyle}>Rating (0–5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={set("rating")}
                placeholder="4.5"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
              gap: "12px",
            }}
          >
            <div>
              <label style={labelStyle}>Brand</label>
              <input
                value={form.brand}
                onChange={set("brand")}
                placeholder="e.g. Samsung"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                value={form.category}
                onChange={set("category")}
                required
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat.slug}
                    value={
                      Array.isArray(cat.apiCategory)
                        ? cat.apiCategory[0]
                        : cat.apiCategory
                    }
                  >
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Thumbnail Image URL</label>
            <input
              value={form.thumbnail}
              onChange={set("thumbnail")}
              placeholder="https://example.com/image.jpg"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />
            {form.thumbnail && (
              <div
                style={{
                  marginTop: "8px",
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                }}
              >
                <img
                  src={form.thumbnail}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={set("tags")}
              placeholder="electronics, wireless, premium"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* Preview */}
          {form.title && form.price && (
            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #a3c4a5",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <p
                style={{
                  fontSize: "0.68rem",
                  fontWeight: "700",
                  color: "#4f7d52",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Preview
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {form.thumbnail && (
                  <img
                    src={form.thumbnail}
                    alt=""
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "6px",
                      objectFit: "cover",
                      border: "1px solid #a3c4a5",
                      flexShrink: 0,
                    }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "0 0 2px",
                    }}
                  >
                    {truncate(form.title, 40)}
                  </p>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "#4f7d52",
                      fontWeight: "800",
                      margin: 0,
                    }}
                  >
                    {formatPrice(
                      discountedPrice(
                        +form.price,
                        +form.discountPercentage || 0,
                      ),
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#fff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: "600",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 2,
                padding: "10px",
                backgroundColor: "#4f7d52",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: "700",
                color: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {saving ? (
                <>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />{" "}
                  Saving...
                </>
              ) : (
                <>
                  <Save style={{ width: "14px", height: "14px" }} />{" "}
                  {form.id ? "Save Changes" : "Add Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ProductsPage() {
  const { data: apiProducts = [], isLoading } = useFeaturedProducts(30);
  const [customProducts, setCustomProducts] = useState(getCustom);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | 'add' | product object
  const [catFilter, setCatFilter] = useState("all");

  const allProducts = useMemo(() => {
    const custom = customProducts.map((p) => ({ ...p, isCustom: true }));
    const api = (apiProducts || []).map((p) => ({ ...p, isCustom: false }));
    return [...custom, ...api];
  }, [customProducts, apiProducts]);

  const filtered = useMemo(
    () =>
      allProducts.filter((p) => {
        const q = search.toLowerCase();
        const okQ =
          !q ||
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q);
        const okC =
          catFilter === "all" ||
          p.category === catFilter ||
          (Array.isArray(p.category)
            ? p.category.includes(catFilter)
            : p.category === catFilter);
        return okQ && okC;
      }),
    [allProducts, search, catFilter],
  );

  const handleSave = (product) => {
    const current = getCustom();
    const existing = current.findIndex((p) => p.id === product.id);
    let next;
    if (existing >= 0) {
      next = current.map((p) => (p.id === product.id ? product : p));
      toast.success("Product updated!");
    } else {
      next = [product, ...current];
      toast.success("Product added!");
    }
    saveCustom(next);
    setCustomProducts(next);
    setModal(null);
  };

  const deleteCustom = (id) => {
    if (!confirm("Delete this product?")) return;
    const next = getCustom().filter((p) => p.id !== id);
    saveCustom(next);
    setCustomProducts(next);
    toast.success("Product deleted");
  };

  const categories = [
    "all",
    ...new Set(
      allProducts
        .map((p) => p.category)
        .filter(Boolean)
        .slice(0, 12),
    ),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.1rem",
              fontWeight: "800",
              color: "#111827",
              margin: "0 0 2px",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Products
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
            {filtered.length} products · {customProducts.length} custom added
          </p>
        </div>
        <button
          onClick={() => setModal("add")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 18px",
            backgroundColor: "#4f7d52",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "0.82rem",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(79,125,82,0.3)",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#3d6440")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#4f7d52")
          }
        >
          <Plus style={{ width: "15px", height: "15px" }} /> Add New Product
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "14px",
              height: "14px",
              color: "#9ca3af",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, brand, category..."
            style={{
              width: "100%",
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "7px",
              padding: "8px 10px 8px 32px",
              fontSize: "0.78rem",
              outline: "none",
              color: "#111827",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "7px",
            fontSize: "0.78rem",
            padding: "8px 12px",
            backgroundColor: "#fff",
            color: "#374151",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Custom products */}
      {customProducts.length > 0 && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #a3c4a5",
            borderRadius: "10px",
            padding: "12px 16px",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: "700",
              color: "#4f7d52",
              margin: "0 0 6px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            ✅ Your Custom Products ({customProducts.length})
          </p>
          <p style={{ fontSize: "0.72rem", color: "#4f7d52", margin: 0 }}>
            These products are saved locally and will appear in your store.
          </p>
        </div>
      )}

      {/* Products grid */}
      {isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
            gap: "12px",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  aspectRatio: "1",
                  background:
                    "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    height: "10px",
                    width: "80%",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "3px",
                  }}
                />
                <div
                  style={{
                    height: "14px",
                    width: "50%",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "64px",
            textAlign: "center",
          }}
        >
          <Package
            style={{
              width: "40px",
              height: "40px",
              color: "#9ca3af",
              margin: "0 auto 12px",
            }}
          />
          <p
            style={{ color: "#374151", fontWeight: "600", marginBottom: "4px" }}
          >
            No products found
          </p>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.82rem",
              marginBottom: "16px",
            }}
          >
            Try adjusting your search or add a new product
          </p>
          <button
            onClick={() => setModal("add")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              backgroundColor: "#4f7d52",
              border: "none",
              borderRadius: "7px",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            <Plus style={{ width: "14px", height: "14px" }} /> Add Product
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 190px), 1fr))",
            gap: "12px",
          }}
        >
          {filtered.map((product) => {
            const final = discountedPrice(
              product.price,
              product.discountPercentage,
            );
            return (
              <div
                key={product.id + (product.isCustom ? "_c" : "")}
                style={{
                  backgroundColor: "#fff",
                  border: `1.5px solid ${product.isCustom ? "#a3c4a5" : "#e5e7eb"}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  position: "relative",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.05)")
                }
              >
                {product.isCustom && (
                  <div
                    style={{
                      position: "absolute",
                      top: "6px",
                      left: "6px",
                      zIndex: 2,
                      backgroundColor: "#4f7d52",
                      color: "#fff",
                      fontSize: "0.55rem",
                      fontWeight: "800",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    CUSTOM
                  </div>
                )}

                {/* Image */}
                <div
                  style={{
                    aspectRatio: "1",
                    backgroundColor: "#f9fafb",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      product.thumbnail ||
                      `https://placehold.co/200x200/4f7d52/white?text=${encodeURIComponent((product.title || "P").slice(0, 1))}`
                    }
                    alt={product.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/200x200/4f7d52/white?text=IMG`;
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: "10px" }}>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      color: "#9ca3af",
                      margin: "0 0 2px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      fontWeight: "600",
                    }}
                  >
                    {product.brand || product.category}
                  </p>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "#111827",
                      margin: "0 0 4px",
                      lineHeight: "1.3",
                      fontWeight: "500",
                    }}
                  >
                    {truncate(product.title, 36)}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                      marginBottom: "6px",
                    }}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: "10px",
                          height: "10px",
                          fill:
                            i < Math.floor(product.rating || 0)
                              ? "#f97316"
                              : "none",
                          color:
                            i < Math.floor(product.rating || 0)
                              ? "#f97316"
                              : "#d1d5db",
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "4px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: "800",
                          color: "#4f7d52",
                          margin: 0,
                        }}
                      >
                        {formatPrice(final)}
                      </p>
                      {product.discountPercentage > 0.5 && (
                        <p
                          style={{
                            fontSize: "0.65rem",
                            color: "#9ca3af",
                            textDecoration: "line-through",
                            margin: 0,
                          }}
                        >
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {product.isCustom && (
                        <button
                          onClick={() => setModal(product)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            backgroundColor: "#f0fdf4",
                            border: "1px solid #a3c4a5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#4f7d52",
                            transition: "background-color 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#dcfce7")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f0fdf4")
                          }
                          title="Edit product"
                        >
                          <Edit2 style={{ width: "12px", height: "12px" }} />
                        </button>
                      )}
                      {product.isCustom && (
                        <button
                          onClick={() => deleteCustom(product.id)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#dc2626",
                            transition: "background-color 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fee2e2")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fef2f2")
                          }
                          title="Delete product"
                        >
                          <Trash2 style={{ width: "12px", height: "12px" }} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      color: product.stock > 0 ? "#6b7280" : "#dc2626",
                      margin: "5px 0 0",
                      fontWeight: "500",
                    }}
                  >
                    {product.stock > 0
                      ? `Stock: ${product.stock}`
                      : "Out of Stock"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }`}</style>
    </div>
  );
}
