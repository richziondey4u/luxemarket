import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Zap,
  Tag,
  Package,
} from "lucide-react";
import { useProduct, useRelatedProducts , useCategories } from "../hooks/useProducts.js";
import { useCart } from "../context/CartContext.jsx";
import { discountedPrice, formatPrice } from "../api/products";
import { useWishlist } from "../context/WishlistContext.jsx";
import ProductCard from "../components/product/ProductCard.jsx";

/* ── Helpers ── */
const isUUID = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(id),
  );

/* ── Stars ── */
function Stars({ rating = 0, count = 0 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          style={{
            width: 14,
            height: 14,
            fill: i < Math.round(rating) ? "#f97316" : "none",
            color: i < Math.round(rating) ? "#f97316" : "var(--border-medium)",
          }}
        />
      ))}
      <span
        style={{
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          marginLeft: "4px",
        }}
      >
        {Number(rating || 0).toFixed(1)} ({count} review{count !== 1 ? "s" : ""}
        )
      </span>
    </div>
  );
}

/* ── Image gallery ── */
function Gallery({ images = [], thumbnail, title }) {
  const list = (() => {
    const arr = [];
    if (thumbnail) arr.push(thumbnail);
    if (Array.isArray(images)) {
      images.forEach((img) => {
        if (img && img !== thumbnail) arr.push(img);
      });
    }
    return arr.length > 0
      ? arr
      : [
          `https://placehold.co/600x600/4f7d52/white?text=${encodeURIComponent((title || "P").slice(0, 8))}`,
        ];
  })();

  const [active, setActive] = useState(0);
  const idx = Math.min(active, list.length - 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          aspectRatio: "1",
          backgroundColor: "var(--bg-muted)",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid var(--border-light)",
        }}
      >
        <img
          src={list[idx]}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/600x600/4f7d52/white?text=IMG`;
          }}
        />
      </div>
      {list.length > 1 && (
        <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: "64px",
                height: "64px",
                flexShrink: 0,
                borderRadius: "8px",
                overflow: "hidden",
                border: `2px solid ${i === idx ? "var(--brand)" : "var(--border-light)"}`,
                padding: 0,
                cursor: "pointer",
                backgroundColor: "var(--bg-muted)",
              }}
            >
              <img
                src={img}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/64x64/4f7d52/white?text=IMG`;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Review card ── */
function ReviewCard({ review }) {
  const name =
    review.reviewerName || review.name || review.user?.name || "Customer";
  const rating = Number(review.rating || 0);
  const comment = review.comment || review.body || "";
  const dateStr = review.date || review.createdAt;
  const date = dateStr
    ? new Date(dateStr).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "10px",
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "var(--brand-light)",
              border: "1px solid var(--brand-mid)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.82rem",
              fontWeight: "700",
              color: "var(--brand)",
              flexShrink: 0,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p
              style={{
                fontSize: "0.82rem",
                fontWeight: "700",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {name}
            </p>
            {date && (
              <p
                style={{
                  fontSize: "0.68rem",
                  color: "var(--text-subtle)",
                  margin: 0,
                }}
              >
                {date}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              style={{
                width: "11px",
                height: "11px",
                fill: i < rating ? "#f97316" : "none",
                color: i < rating ? "#f97316" : "var(--border-medium)",
              }}
            />
          ))}
        </div>
      </div>
      {comment && (
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          {comment}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════
   MAIN PAGE
══════════════════════════════ */
export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);

  /* ── Fetch — works for UUID (DB) and numeric (DummyJSON) ── */
  const { data: product, isLoading, isError, error } = useProduct(id);

  /* ── Get category string regardless of shape ── */
  const categoryStr = (() => {
    if (!product) return "";
    if (typeof product.category === "object" && product.category !== null) {
      return product.category.slug || product.category.name || "";
    }
    return String(product.category || "");
  })();

  const { data: related = [] } = useRelatedProducts(categoryStr, id);

  /* ── Normalize both DummyJSON and DB shapes ── */
  const p = product
    ? {
        id: product.id,
        title: product.title || "Untitled Product",
        description: product.description || "No description available.",
        price: Number(product.price) || 0,
        discountPercentage: Number(product.discountPercentage) || 0,
        stock: Number(product.stock) ?? 0,
        brand: product.brand || categoryStr || "",
        category: categoryStr,
        rating: Number(product.rating) || 0,
        reviews: Array.isArray(product.reviews) ? product.reviews : [],
        thumbnail:
          product.thumbnail ||
          (Array.isArray(product.images) ? product.images[0] : "") ||
          "",
        images: Array.isArray(product.images) ? product.images : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
      }
    : null;

  const finalPrice = p ? discountedPrice(p.price, p.discountPercentage) : 0;
  const savings = p ? p.price - finalPrice : 0;
  const inStock = p ? p.stock > 0 : false;
  const wishlisted = p ? isWishlisted(p.id) : false;

  const handleAddToCart = () => {
    if (!p || !inStock) return;
    addItem({ ...p }, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    if (!p || !inStock) return;
    addItem({ ...p }, qty);
    navigate("/cart");
  };

  /* ── Loading ── */
  if (isLoading)
    return (
      <div style={{ backgroundColor: "var(--bg-section)", minHeight: "100vh" }}>
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px 16px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(min(100%,320px),1fr))",
              gap: "32px",
            }}
          >
            <div
              style={{ aspectRatio: "1", borderRadius: "12px" }}
              className="shimmer-bg"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                paddingTop: "8px",
              }}
            >
              <div
                style={{ height: "14px", width: "30%", borderRadius: "4px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "28px", width: "90%", borderRadius: "4px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "20px", width: "50%", borderRadius: "4px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "60px", borderRadius: "8px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "48px", borderRadius: "8px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "48px", borderRadius: "8px" }}
                className="shimmer-bg"
              />
            </div>
          </div>
        </div>
      </div>
    );

  /* ── Error / Not found ── */
  if (isError || !product)
    return (
      <div
        style={{
          backgroundColor: "var(--bg-section)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📦</div>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.5rem",
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Product Not Found
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "24px",
              fontSize: "0.875rem",
              lineHeight: "1.6",
            }}
          >
            {error?.message ||
              "This product may have been removed or the link is incorrect."}
          </p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 20px",
                backgroundColor: "var(--bg-card)",
                border: "1.5px solid var(--border-medium)",
                borderRadius: "8px",
                color: "var(--text-secondary)",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <ArrowLeft style={{ width: "14px", height: "14px" }} /> Go Back
            </button>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 20px",
                backgroundColor: "var(--brand)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Browse Store
            </Link>
          </div>
        </div>
      </div>
    );

  /* ── Main render ── */
  return (
    <div style={{ backgroundColor: "var(--bg-section)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "10px 16px" }}
        >
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              style={{ color: "var(--text-muted)", textDecoration: "none" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--brand)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              Home
            </Link>
            <ChevronRight
              style={{
                width: "12px",
                height: "12px",
                color: "var(--text-subtle)",
              }}
            />
            {p.category && (
              <>
                <Link
                  to={`/category/${p.category}`}
                  style={{
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    textTransform: "capitalize",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--brand)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                >
                  {p.category}
                </Link>
                <ChevronRight
                  style={{
                    width: "12px",
                    height: "12px",
                    color: "var(--text-subtle)",
                  }}
                />
              </>
            )}
            <span
              style={{
                color: "var(--text-primary)",
                fontWeight: "600",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "200px",
              }}
            >
              {p.title}
            </span>
          </nav>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "20px 16px 48px",
        }}
      >
        {/* Product grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
            gap: "32px",
            marginBottom: "32px",
            alignItems: "start",
          }}
        >
          {/* Gallery */}
          <div style={{ position: "sticky", top: "80px" }}>
            <Gallery
              thumbnail={p.thumbnail}
              images={p.images}
              title={p.title}
            />
          </div>

          {/* Info */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Brand + title */}
            <div>
              {p.brand && (
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    color: "var(--brand)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "6px",
                  }}
                >
                  {p.brand}
                </p>
              )}
              <h1
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.2rem,3vw,1.75rem)",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  lineHeight: "1.25",
                  marginBottom: "10px",
                }}
              >
                {p.title}
              </h1>
              <Stars rating={p.rating} count={product.reviewCount} />
            </div>

            {/* Price */}
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "10px",
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginBottom: savings > 0 ? "6px" : 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "clamp(1.5rem,4vw,2rem)",
                    fontWeight: "800",
                    color: "var(--brand)",
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(finalPrice)}
                </span>
                {p.discountPercentage > 0.5 && (
                  <>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        color: "var(--text-subtle)",
                        textDecoration: "line-through",
                        lineHeight: 1.4,
                      }}
                    >
                      {formatPrice(p.price)}
                    </span>
                    <span
                      style={{
                        backgroundColor: "#f97316",
                        color: "#fff",
                        fontSize: "0.72rem",
                        fontWeight: "800",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      -{Math.round(p.discountPercentage)}% OFF
                    </span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#059669",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  You save {formatPrice(savings)} 🎉
                </p>
              )}
            </div>

            {/* Stock */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {inStock ? (
                <>
                  <CheckCircle
                    style={{ width: "14px", height: "14px", color: "#059669" }}
                  />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "#059669",
                      fontWeight: "600",
                    }}
                  >
                    {p.stock < 10 ? `Only ${p.stock} left!` : "In Stock"}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle
                    style={{ width: "14px", height: "14px", color: "#dc2626" }}
                  />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "#dc2626",
                      fontWeight: "600",
                    }}
                  >
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Tags */}
            {p.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Tag
                  style={{
                    width: "13px",
                    height: "13px",
                    color: "var(--text-subtle)",
                  }}
                />
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--text-muted)",
                      backgroundColor: "var(--bg-muted)",
                      border: "1px solid var(--border-light)",
                      padding: "2px 8px",
                      borderRadius: "99px",
                      fontWeight: "500",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity */}
            {inStock && (
              <div>
                <p
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  Quantity
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    style={{
                      width: "38px",
                      height: "38px",
                      backgroundColor: "var(--bg-card)",
                      border: "1.5px solid var(--border-medium)",
                      borderRight: "none",
                      borderRadius: "8px 0 0 8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: qty <= 1 ? "not-allowed" : "pointer",
                      color:
                        qty <= 1 ? "var(--text-subtle)" : "var(--text-primary)",
                    }}
                  >
                    <Minus style={{ width: "14px", height: "14px" }} />
                  </button>
                  <div
                    style={{
                      width: "52px",
                      height: "38px",
                      border: "1.5px solid var(--border-medium)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                      backgroundColor: "var(--bg-card)",
                    }}
                  >
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty((q) => Math.min(p.stock, q + 1))}
                    disabled={qty >= p.stock}
                    style={{
                      width: "38px",
                      height: "38px",
                      backgroundColor: "var(--bg-card)",
                      border: "1.5px solid var(--border-medium)",
                      borderLeft: "none",
                      borderRadius: "0 8px 8px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: qty >= p.stock ? "not-allowed" : "pointer",
                      color:
                        qty >= p.stock
                          ? "var(--text-subtle)"
                          : "var(--text-primary)",
                    }}
                  >
                    <Plus style={{ width: "14px", height: "14px" }} />
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "13px 24px",
                  borderRadius: "8px",
                  backgroundColor: addedToCart
                    ? "#059669"
                    : inStock
                      ? "var(--brand)"
                      : "var(--bg-muted)",
                  color: inStock ? "#fff" : "var(--text-subtle)",
                  border: "none",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  cursor: inStock ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  boxShadow: inStock
                    ? "0 4px 14px rgba(79,125,82,0.3)"
                    : "none",
                }}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle style={{ width: "18px", height: "18px" }} />{" "}
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart style={{ width: "18px", height: "18px" }} />{" "}
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "13px 24px",
                  borderRadius: "8px",
                  backgroundColor: inStock ? "#f97316" : "var(--bg-muted)",
                  color: inStock ? "#fff" : "var(--text-subtle)",
                  border: "none",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  cursor: inStock ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                <Zap style={{ width: "18px", height: "18px" }} /> Buy Now
              </button>
              <button
                onClick={() => toggle(p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  backgroundColor: wishlisted ? "#fff1f2" : "var(--bg-card)",
                  color: wishlisted ? "#ef4444" : "var(--text-secondary)",
                  border: `1.5px solid ${wishlisted ? "#fecdd3" : "var(--border-medium)"}`,
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Heart
                  style={{
                    width: "16px",
                    height: "16px",
                    fill: wishlisted ? "#ef4444" : "none",
                  }}
                />
                {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Trust badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "8px",
              }}
            >
              {[
                {
                  icon: <Truck style={{ width: "16px", height: "16px" }} />,
                  label: "Fast Delivery",
                  sub: "2–7 days",
                },
                {
                  icon: <Shield style={{ width: "16px", height: "16px" }} />,
                  label: "Secure Pay",
                  sub: "Paystack",
                },
                {
                  icon: <RotateCcw style={{ width: "16px", height: "16px" }} />,
                  label: "Easy Return",
                  sub: "30 days",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    padding: "10px 6px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: "var(--brand)" }}>{b.icon}</span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                    }}
                  >
                    {b.label}
                  </span>
                  <span
                    style={{ fontSize: "0.62rem", color: "var(--text-subtle)" }}
                  >
                    {b.sub}
                  </span>
                </div>
              ))}
            </div>

            {/* Meta info */}
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "10px",
                padding: "14px 16px",
              }}
            >
              {[
                { label: "Category", value: p.category },
                { label: "Brand", value: p.brand },
                {
                  label: "Stock",
                  value: inStock ? `${p.stock} units` : "Out of stock",
                },
                { label: "Rating", value: `${p.rating}/5` },
              ]
                .filter((r) => r.value)
                .map((row, i, arr) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px solid var(--border-light)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        fontWeight: "500",
                      }}
                    >
                      {row.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-primary)",
                        fontWeight: "600",
                        textTransform: "capitalize",
                        textAlign: "right",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--border-light)",
              backgroundColor: "var(--bg-section)",
            }}
          >
            {[
              { id: "description", label: "Description" },
              { id: "reviews", label: `Reviews (${p.reviews.length})` },
              { id: "shipping", label: "Shipping & Returns" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "13px 20px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  borderBottom: `2.5px solid ${activeTab === tab.id ? "var(--brand)" : "transparent"}`,
                  color:
                    activeTab === tab.id ? "var(--brand)" : "var(--text-muted)",
                  transition: "color 0.2s",
                  marginBottom: "-1px",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "20px 24px" }}>
            {activeTab === "description" && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  lineHeight: "1.8",
                  margin: 0,
                }}
              >
                {p.description}
              </p>
            )}
            {activeTab === "reviews" &&
              (p.reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px" }}>
                  <Star
                    style={{
                      width: "36px",
                      height: "36px",
                      color: "var(--text-subtle)",
                      margin: "0 auto 10px",
                    }}
                  />
                  <p style={{ color: "var(--text-muted)" }}>
                    No reviews yet. Be the first!
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {p.reviews.map((review, i) => (
                    <ReviewCard key={i} review={review} />
                  ))}
                </div>
              ))}
            {activeTab === "shipping" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  {
                    icon: <Truck style={{ width: "18px", height: "18px" }} />,
                    title: "Standard Delivery",
                    detail: "2–5 days Lagos, 3–7 days other states.",
                  },
                  {
                    icon: <Zap style={{ width: "18px", height: "18px" }} />,
                    title: "Express Delivery",
                    detail: "1–2 days in Lagos and Abuja.",
                  },
                  {
                    icon: <Package style={{ width: "18px", height: "18px" }} />,
                    title: "Free Shipping",
                    detail: "On orders over ₦80,000.",
                  },
                  {
                    icon: (
                      <RotateCcw style={{ width: "18px", height: "18px" }} />
                    ),
                    title: "30-Day Returns",
                    detail: "Return unused items in original packaging.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "12px 14px",
                      backgroundColor: "var(--bg-section)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-light)",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "var(--brand-light)",
                        border: "1px solid var(--brand-mid)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--brand)",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          color: "var(--text-primary)",
                          margin: "0 0 3px",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                          margin: 0,
                          lineHeight: "1.5",
                        }}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--brand)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  color: "#fff",
                  margin: 0,
                }}
              >
                Related Products
              </h2>
              {p.category && (
                <Link
                  to={`/category/${p.category}`}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    color: "#fff",
                    textDecoration: "none",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "3px 10px",
                    borderRadius: "99px",
                  }}
                >
                  See All →
                </Link>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(min(100%,160px),1fr))",
                gap: "1px",
                backgroundColor: "var(--border-light)",
              }}
            >
              {related.map((prod) => (
                <div
                  key={prod.id}
                  style={{ backgroundColor: "var(--bg-card)", padding: "8px" }}
                >
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
