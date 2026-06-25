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
  Share2,
  Tag,
  Package,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { useProduct, useRelatedProducts } from "../hooks/useProducts.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import {
  formatPrice,
  discountedPrice,
  getCategoryBySlug,
} from "../api/products.js";
import ProductCard from "../components/product/ProductCard.jsx";
import ProductSkeleton from "../components/product/ProductSkeleton.jsx";

/* ── Star rating row ── */
function Stars({ rating = 0, count = 0, size = 14 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          style={{
            width: size,
            height: size,
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
        {Number(rating).toFixed(1)} ({count} review{count !== 1 ? "s" : ""})
      </span>
    </div>
  );
}

/* ── Image gallery ── */
function Gallery({ images = [], thumbnail, title }) {
  // Build a clean image list — use thumbnail as fallback
  const allImages = (() => {
    const list = [];
    if (thumbnail) list.push(thumbnail);
    if (Array.isArray(images)) {
      images.forEach((img) => {
        if (img && img !== thumbnail) list.push(img);
      });
    }
    return list.length > 0
      ? list
      : [
          `https://placehold.co/600x600/4f7d52/white?text=${encodeURIComponent((title || "P").slice(0, 10))}`,
        ];
  })();

  const [active, setActive] = useState(0);

  const safeActive = Math.min(active, allImages.length - 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Main image */}
      <div
        style={{
          aspectRatio: "1",
          backgroundColor: "var(--bg-muted)",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid var(--border-light)",
          position: "relative",
        }}
      >
        <img
          src={allImages[safeActive]}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/600x600/4f7d52/white?text=${encodeURIComponent((title || "P").slice(0, 10))}`;
          }}
        />
      </div>

      {/* Thumbnails — only show if more than 1 image */}
      {allImages.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: "64px",
                height: "64px",
                flexShrink: 0,
                borderRadius: "8px",
                overflow: "hidden",
                border: `2px solid ${i === safeActive ? "var(--brand)" : "var(--border-light)"}`,
                padding: 0,
                cursor: "pointer",
                transition: "border-color 0.2s",
                backgroundColor: "var(--bg-muted)",
              }}
            >
              <img
                src={img}
                alt={`View ${i + 1}`}
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
  const name = review.reviewerName || review.name || "Customer";
  const rating = review.rating || 0;
  const comment = review.comment || review.body || "";
  const date =
    review.date || review.createdAt
      ? new Date(review.date || review.createdAt).toLocaleDateString("en-NG", {
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
        <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
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

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);

  /* ── Fetch product — works for both DummyJSON and custom ── */
  const { data: product, isLoading, isError } = useProduct(id);

  /* ── Derive category slug for related products ── */
  const categorySlug = (() => {
    if (!product) return null;
    // Custom products store category as slug
    if (String(product.id).startsWith("custom_")) {
      return product.category || null;
    }
    // DummyJSON products store category as the raw apiCategory string
    // We need to find our slug that maps to it
    const { CATEGORIES } = require("../api/products.js"); // handled below via import
    return product.category || null;
  })();

  const { data: related = [] } = useRelatedProducts(
    product?.category || "",
    id,
  );

  /* ── Normalize product fields ── */
  const normalized = product
    ? {
        id: product.id,
        title: product.title || "Untitled Product",
        description: product.description || "No description available.",
        price: Number(product.price) || 0,
        discountPercentage: Number(product.discountPercentage) || 0,
        stock: Number(product.stock) ?? 0,
        brand: product.brand || product.category || "",
        category: product.category || "",
        rating: Number(product.rating) || 0,
        reviews: Array.isArray(product.reviews) ? product.reviews : [],
        thumbnail: product.thumbnail || "",
        images: Array.isArray(product.images) ? product.images : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        isCustom: String(product.id).startsWith("custom_"),
      }
    : null;

  const finalPrice = normalized
    ? discountedPrice(normalized.price, normalized.discountPercentage)
    : 0;
  const savings = normalized ? normalized.price - finalPrice : 0;
  const inStock = normalized ? normalized.stock > 0 : false;
  const wishlisted = normalized ? isWishlisted(normalized.id) : false;

  const handleAddToCart = () => {
    if (!normalized || !inStock) return;
    addItem({ ...normalized }, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    if (!normalized || !inStock) return;
    addItem({ ...normalized }, qty);
    navigate("/cart");
  };

  /* ══════════════════════════════════
     LOADING STATE
  ══════════════════════════════════ */
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
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
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
                style={{ height: "24px", width: "90%", borderRadius: "4px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "20px", width: "50%", borderRadius: "4px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "40px", width: "35%", borderRadius: "4px" }}
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

  /* ══════════════════════════════════
     ERROR / NOT FOUND
  ══════════════════════════════════ */
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
            This product may have been removed or the link is incorrect.
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
              className="btn-primary"
              style={{ borderRadius: "8px", fontSize: "0.82rem" }}
            >
              Browse Store
            </Link>
          </div>
        </div>
      </div>
    );

  /* ══════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════ */
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
            {normalized.category && (
              <>
                <Link
                  to={`/category/${normalized.category}`}
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
                  {normalized.category}
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
              {normalized.title}
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
        {/* ── Main product section ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "32px",
            marginBottom: "32px",
            alignItems: "start",
          }}
        >
          {/* Left — Gallery */}
          <div style={{ position: "sticky", top: "80px" }}>
            {normalized.isCustom && (
              <div
                style={{
                  marginBottom: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  backgroundColor: "var(--brand-light)",
                  border: "1px solid var(--brand-mid)",
                  borderRadius: "99px",
                  padding: "3px 10px",
                }}
              >
                <CheckCircle
                  style={{
                    width: "11px",
                    height: "11px",
                    color: "var(--brand)",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    color: "var(--brand)",
                    letterSpacing: "0.06em",
                  }}
                >
                  FEATURED PRODUCT
                </span>
              </div>
            )}
            <Gallery
              thumbnail={normalized.thumbnail}
              images={normalized.images}
              title={normalized.title}
            />
          </div>

          {/* Right — Product info */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Brand + title */}
            <div>
              {normalized.brand && (
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
                  {normalized.brand}
                </p>
              )}
              <h1
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  lineHeight: "1.25",
                  marginBottom: "10px",
                }}
              >
                {normalized.title}
              </h1>
              <Stars
                rating={normalized.rating}
                count={normalized.reviews.length}
              />
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
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: "800",
                    color: "var(--brand)",
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(finalPrice)}
                </span>
                {normalized.discountPercentage > 0.5 && (
                  <>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        color: "var(--text-subtle)",
                        textDecoration: "line-through",
                        lineHeight: 1.4,
                      }}
                    >
                      {formatPrice(normalized.price)}
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
                      -{Math.round(normalized.discountPercentage)}% OFF
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

            {/* Stock status */}
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
                    {normalized.stock < 10
                      ? `Only ${normalized.stock} left in stock!`
                      : "In Stock"}
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
            {normalized.tags.length > 0 && (
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
                {normalized.tags.map((tag) => (
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

            {/* Quantity selector */}
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0" }}
                >
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
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (qty > 1)
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-muted)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--bg-card)")
                    }
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
                    onClick={() =>
                      setQty((q) => Math.min(normalized.stock, q + 1))
                    }
                    disabled={qty >= normalized.stock}
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
                      cursor:
                        qty >= normalized.stock ? "not-allowed" : "pointer",
                      color:
                        qty >= normalized.stock
                          ? "var(--text-subtle)"
                          : "var(--text-primary)",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (qty < normalized.stock)
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-muted)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--bg-card)")
                    }
                  >
                    <Plus style={{ width: "14px", height: "14px" }} />
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
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
                onMouseEnter={(e) => {
                  if (inStock && !addedToCart)
                    e.currentTarget.style.backgroundColor = "var(--brand-dark)";
                }}
                onMouseLeave={(e) => {
                  if (!addedToCart)
                    e.currentTarget.style.backgroundColor = inStock
                      ? "var(--brand)"
                      : "var(--bg-muted)";
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
                onMouseEnter={(e) => {
                  if (inStock)
                    e.currentTarget.style.backgroundColor = "#ea580c";
                }}
                onMouseLeave={(e) => {
                  if (inStock)
                    e.currentTarget.style.backgroundColor = "#f97316";
                }}
              >
                <Zap style={{ width: "18px", height: "18px" }} /> Buy Now
              </button>

              <button
                onClick={() => toggle(normalized)}
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
                gridTemplateColumns: "repeat(3, 1fr)",
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

            {/* Product meta */}
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "10px",
                padding: "14px 16px",
              }}
            >
              {[
                { label: "Category", value: normalized.category },
                { label: "Brand", value: normalized.brand },
                {
                  label: "Stock",
                  value: inStock ? `${normalized.stock} units` : "Out of stock",
                },
                { label: "Rating", value: `${normalized.rating}/5` },
              ]
                .filter((r) => r.value)
                .map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      borderBottom:
                        i < 3 ? "1px solid var(--border-light)" : "none",
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

        {/* ── Tabs: Description / Reviews ── */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "32px",
          }}
        >
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--border-light)",
              backgroundColor: "var(--bg-section)",
            }}
          >
            {[
              { id: "description", label: "Description" },
              {
                id: "reviews",
                label: `Reviews (${normalized.reviews.length})`,
              },
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

          {/* Tab content */}
          <div style={{ padding: "20px 24px" }}>
            {activeTab === "description" && (
              <div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    lineHeight: "1.8",
                    margin: 0,
                  }}
                >
                  {normalized.description}
                </p>
                {normalized.tags.length > 0 && (
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    {normalized.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                          backgroundColor: "var(--bg-muted)",
                          border: "1px solid var(--border-light)",
                          padding: "3px 10px",
                          borderRadius: "99px",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {normalized.reviews.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 16px" }}>
                    <Star
                      style={{
                        width: "36px",
                        height: "36px",
                        color: "var(--text-subtle)",
                        margin: "0 auto 10px",
                      }}
                    />
                    <p
                      style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
                    >
                      No reviews yet. Be the first to review this product!
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
                    {normalized.reviews.map((review, i) => (
                      <ReviewCard key={i} review={review} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {[
                  {
                    icon: <Truck style={{ width: "18px", height: "18px" }} />,
                    title: "Standard Delivery",
                    detail: "2–5 business days in Lagos, 3–7 for other states.",
                  },
                  {
                    icon: <Zap style={{ width: "18px", height: "18px" }} />,
                    title: "Express Delivery",
                    detail: "1–2 days available in Lagos and Abuja.",
                  },
                  {
                    icon: <Package style={{ width: "18px", height: "18px" }} />,
                    title: "Free Shipping",
                    detail: "On all orders over ₦80,000 (approx $50 USD).",
                  },
                  {
                    icon: (
                      <RotateCcw style={{ width: "18px", height: "18px" }} />
                    ),
                    title: "30-Day Returns",
                    detail:
                      "Return unused items in original packaging within 30 days for a full refund.",
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

        {/* ── Related products ── */}
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
              {normalized.category && (
                <Link
                  to={`/category/${normalized.category}`}
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
                  "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
                gap: "1px",
                backgroundColor: "var(--border-light)",
              }}
            >
              {related.map((p) => (
                <div
                  key={p.id}
                  style={{ backgroundColor: "var(--bg-card)", padding: "8px" }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
