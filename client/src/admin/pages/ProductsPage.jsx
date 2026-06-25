import { useState, useMemo, useCallback } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Star,
  Package,
  RefreshCw,
} from "lucide-react";
import {
  CATEGORIES,
  formatPrice,
  discountedPrice,
} from "../../api/products.js";
import { truncate } from "../../lib/utils.js";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import toast from "react-hot-toast";

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

const EMPTY = {
  title: "",
  description: "",
  price: "",
  discountPercentage: 0,
  stock: 10,
  brand: "",
  category: "smartphones",
  thumbnail: "",
  tags: "",
  isFeatured: false,
};

/* ── Product Modal ── */
function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product
      ? {
          ...product,
          tags: Array.isArray(product.tags)
            ? product.tags.join(", ")
            : product.tags || "",
        }
      : EMPTY,
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.value }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((v) => ({ ...v, thumbnail: ev.target.result }));
      setUploading(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read image");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.price || isNaN(+form.price)) {
      toast.error("Valid price is required");
      return;
    }
    if (+form.price <= 0) {
      toast.error("Price must be > 0");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || "",
        price: Number(form.price),
        discountPercentage: Number(form.discountPercentage) || 0,
        stock: Number(form.stock) || 0,
        brand: form.brand || "",
        thumbnail: form.thumbnail || "",
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        isFeatured: Boolean(form.isFeatured),
        images: form.thumbnail ? [form.thumbnail] : [],
      };

      let result;
      if (form.id) {
        // Update existing
        const d = await apiFetch(`/admin/products/${form.id}`, {
          method: "PUT",
          body: payload,
        });
        result = d.data.product;
      } else {
        // Create new — saves to PostgreSQL
        const d = await apiFetch("/admin/products", {
          method: "POST",
          body: payload,
        });
        result = d.data.product;
      }

      onSave(result, !!form.id);
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const inp = {
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
  const lbl = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };
  const foc = (e) => {
    e.currentTarget.style.borderColor = "#4f7d52";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79,125,82,0.1)";
  };
  const blr = (e) => {
    e.currentTarget.style.borderColor = "#e5e7eb";
    e.currentTarget.style.boxShadow = "none";
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

        <form
          onSubmit={handleSave}
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Title */}
          <div>
            <label style={lbl}>Product Title *</label>
            <input
              value={form.title}
              onChange={set("title")}
              required
              placeholder="e.g. Premium Wireless Earbuds"
              style={inp}
              onFocus={foc}
              onBlur={blr}
            />
          </div>

          {/* Description */}
          <div>
            <label style={lbl}>Description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Describe the product..."
              style={{ ...inp, resize: "vertical" }}
              onFocus={foc}
              onBlur={blr}
            />
          </div>

          {/* Price / Discount / Stock / Rating */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 130px), 1fr))",
              gap: "12px",
            }}
          >
            <div>
              <label style={lbl}>Price (USD) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={set("price")}
                required
                placeholder="29.99"
                style={inp}
                onFocus={foc}
                onBlur={blr}
              />
              {form.price && !isNaN(+form.price) && (
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
              <label style={lbl}>Discount %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.discountPercentage}
                onChange={set("discountPercentage")}
                placeholder="0"
                style={inp}
                onFocus={foc}
                onBlur={blr}
              />
            </div>
            <div>
              <label style={lbl}>Stock Qty</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={set("stock")}
                placeholder="10"
                style={inp}
                onFocus={foc}
                onBlur={blr}
              />
            </div>
          </div>

          {/* Brand / Category */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "12px",
            }}
          >
            <div>
              <label style={lbl}>Brand</label>
              <input
                value={form.brand}
                onChange={set("brand")}
                placeholder="e.g. Samsung"
                style={inp}
                onFocus={foc}
                onBlur={blr}
              />
            </div>
            <div>
              <label style={lbl}>Category *</label>
              <select
                value={form.category}
                onChange={set("category")}
                style={{ ...inp, cursor: "pointer" }}
                onFocus={foc}
                onBlur={blr}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              id="featured"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm((v) => ({ ...v, isFeatured: e.target.checked }))
              }
              style={{
                width: "16px",
                height: "16px",
                accentColor: "#4f7d52",
                cursor: "pointer",
              }}
            />
            <label
              htmlFor="featured"
              style={{
                fontSize: "0.82rem",
                fontWeight: "600",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              Mark as Featured Product
            </label>
          </div>

          {/* Tags */}
          <div>
            <label style={lbl}>Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={set("tags")}
              placeholder="wireless, premium, sale"
              style={inp}
              onFocus={foc}
              onBlur={blr}
            />
          </div>

          {/* Photo upload */}
          <div>
            <label style={lbl}>Product Photo</label>
            <div
              style={{
                border: `2px dashed ${form.thumbnail ? "#4f7d52" : "#e5e7eb"}`,
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#f9fafb",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => document.getElementById("admin-prod-img").click()}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#4f7d52")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = form.thumbnail
                  ? "#4f7d52"
                  : "#e5e7eb")
              }
            >
              {form.thumbnail ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={form.thumbnail}
                    alt="Preview"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #a3c4a5",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/120x120/4f7d52/white?text=IMG";
                    }}
                  />
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setForm((v) => ({ ...v, thumbnail: "" }));
                    }}
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : uploading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      border: "3px solid #e5e7eb",
                      borderTopColor: "#4f7d52",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <p
                    style={{ fontSize: "0.78rem", color: "#6b7280", margin: 0 }}
                  >
                    Processing image...
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #a3c4a5",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4f7d52"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: "600",
                        color: "#374151",
                        margin: "0 0 2px",
                      }}
                    >
                      Click to upload photo
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "#9ca3af",
                        margin: 0,
                      }}
                    >
                      JPG, PNG, WebP — max 5MB
                    </p>
                  </div>
                </div>
              )}
              <input
                id="admin-prod-img"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>

            <p
              style={{
                fontSize: "0.68rem",
                color: "#9ca3af",
                marginTop: "6px",
                textAlign: "center",
              }}
            >
              — or paste image URL below —
            </p>
            <input
              value={
                form.thumbnail?.startsWith("data:") ? "" : form.thumbnail || ""
              }
              onChange={(e) =>
                setForm((v) => ({ ...v, thumbnail: e.target.value }))
              }
              placeholder="https://example.com/image.jpg"
              style={{ ...inp, fontSize: "0.75rem", marginTop: "4px" }}
              onFocus={foc}
              onBlur={blr}
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
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Preview
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                {form.thumbnail && (
                  <img
                    src={form.thumbnail}
                    alt=""
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "8px",
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
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "0 0 2px",
                    }}
                  >
                    {truncate(form.title, 40)}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#4f7d52",
                      fontWeight: "800",
                      margin: 0,
                    }}
                  >
                    {formatPrice(
                      discountedPrice(
                        +form.price || 0,
                        +form.discountPercentage || 0,
                      ),
                    )}
                  </p>
                  {form.isFeatured && (
                    <span
                      style={{
                        fontSize: "0.62rem",
                        backgroundColor: "#fef3c7",
                        color: "#d97706",
                        padding: "1px 6px",
                        borderRadius: "3px",
                        fontWeight: "700",
                        marginTop: "3px",
                        display: "inline-block",
                      }}
                    >
                      FEATURED
                    </span>
                  )}
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
                padding: "11px",
                backgroundColor: "#fff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "0.85rem",
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
                padding: "11px",
                backgroundColor: "#4f7d52",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
              }}
            >
              {saving ? (
                <>
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />{" "}
                  Saving to Database...
                </>
              ) : (
                <>
                  <Save style={{ width: "15px", height: "15px" }} />{" "}
                  {form.id ? "Save Changes" : "Add Product to Store"}
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

/* ── Main ProductsPage ── */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(search && { search }),
      });
      const d = await apiFetch(`/admin/products?${params}`);
      setProducts(d.data.products || []);
      setTotalPages(d.data.pagination?.pages || 1);
    } catch (err) {
      toast.error("Failed to load products: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSave = (product, isUpdate) => {
    if (isUpdate) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p)),
      );
      toast.success("Product updated! ✅");
    } else {
      setProducts((prev) => [product, ...prev]);
      toast.success(
        "Product added to database! 🎉 It will now show on the store.",
      );
    }
    setModal(null);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
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
            {products.length} product(s) in database
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={loadProducts}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 14px",
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              color: "#374151",
              fontSize: "0.78rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <RefreshCw style={{ width: "13px", height: "13px" }} /> Refresh
          </button>
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
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
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
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products by name, brand..."
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

      {/* Info banner */}
      <div
        style={{
          backgroundColor: "#f0fdf4",
          border: "1px solid #a3c4a5",
          borderRadius: "8px",
          padding: "10px 14px",
          fontSize: "0.78rem",
          color: "#4f7d52",
        }}
      >
        ✅ Products added here are saved to your PostgreSQL database and will
        appear on the store immediately.
      </div>

      {/* Product grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 180px), 1fr))",
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
                  animation: "shimmer 1.4s infinite",
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
      ) : products.length === 0 ? (
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
            No products in database yet
          </p>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.82rem",
              marginBottom: "16px",
            }}
          >
            Add your first product — it will immediately appear on the store!
          </p>
          <button
            onClick={() => setModal("add")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 20px",
              backgroundColor: "#4f7d52",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            <Plus style={{ width: "14px", height: "14px" }} /> Add First Product
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 185px), 1fr))",
            gap: "12px",
          }}
        >
          {products.map((product) => {
            const final = discountedPrice(
              product.price,
              product.discountPercentage,
            );
            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: "#fff",
                  border: `1.5px solid ${product.isFeatured ? "#a3c4a5" : "#e5e7eb"}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.2s",
                  position: "relative",
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
                {product.isFeatured && (
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
                    }}
                  >
                    FEATURED
                  </div>
                )}
                {!product.isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      zIndex: 2,
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      fontSize: "0.55rem",
                      fontWeight: "800",
                      padding: "2px 6px",
                      borderRadius: "3px",
                    }}
                  >
                    INACTIVE
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
                      `https://placehold.co/200x200/4f7d52/white?text=${encodeURIComponent((product.title || "P").charAt(0))}`
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
                      fontSize: "0.62rem",
                      color: "#9ca3af",
                      margin: "0 0 2px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    {product.brand || product.category?.name || "No brand"}
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
                    {truncate(product.title, 34)}
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
                    <span
                      style={{
                        fontSize: "0.62rem",
                        color: "#9ca3af",
                        marginLeft: "2px",
                      }}
                    >
                      ({product.reviewCount || 0})
                    </span>
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
                      {product.discountPercentage > 0 && (
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
                        }}
                        title="Edit"
                      >
                        <Edit2 style={{ width: "12px", height: "12px" }} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
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
                        }}
                        title="Delete"
                      >
                        <Trash2 style={{ width: "12px", height: "12px" }} />
                      </button>
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
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            marginTop: "8px",
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                fontSize: "0.78rem",
                fontWeight: "600",
                border: "1px solid",
                cursor: "pointer",
                backgroundColor: page === p ? "#4f7d52" : "#fff",
                borderColor: page === p ? "#4f7d52" : "#e5e7eb",
                color: page === p ? "#fff" : "#374151",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
      `}</style>
    </div>
  );
}
