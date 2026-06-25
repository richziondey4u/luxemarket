import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  ShoppingCart,
  Heart,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  Shield,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import {
  useFeaturedProducts,
  useNewArrivals,
  useBestSellers,
  useProductsByCategory,
} from "../hooks/useProducts.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { CATEGORIES, formatPrice, discountedPrice } from "../api/products.js";
import { truncate } from "../lib/utils.js";

/* ── Countdown hook ── */
function useCountdown(hours = 12) {
  const getMs = () => {
    const saved = sessionStorage.getItem("deals_end");
    if (saved) {
      const diff = parseInt(saved) - Date.now();
      if (diff > 0) return diff;
    }
    const end = Date.now() + hours * 3600000;
    sessionStorage.setItem("deals_end", end.toString());
    return hours * 3600000;
  };
  const [ms, setMs] = useState(getMs);
  useEffect(() => {
    const t = setInterval(() => setMs((p) => (p <= 1000 ? 0 : p - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    h: String(Math.floor(ms / 3600000)).padStart(2, "0"),
    m: String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0"),
    s: String(Math.floor((ms % 60000) / 1000)).padStart(2, "0"),
  };
}

/* ── Mini product card (Jumia style) ── */
function MiniCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const final = discountedPrice(product.price, product.discountPercentage);
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "all 0.2s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1",
          overflow: "hidden",
          backgroundColor: "var(--bg-muted)",
        }}
      >
        <Link to={`/product/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>
        {product.discountPercentage > 0.5 && (
          <span
            style={{
              position: "absolute",
              top: "6px",
              left: "6px",
              backgroundColor: "#f97316",
              color: "#fff",
              fontSize: "0.62rem",
              fontWeight: "800",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          onClick={() => toggle(product)}
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: wishlisted ? "#ef4444" : "var(--text-subtle)",
          }}
        >
          <Heart
            style={{
              width: "12px",
              height: "12px",
              fill: wishlisted ? "#ef4444" : "none",
            }}
          />
        </button>
      </div>

      {/* Info */}
      <div
        style={{
          padding: "8px 10px 10px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-primary)",
              lineHeight: "1.35",
              fontWeight: "400",
              margin: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
          >
            {truncate(product.title, 38)}
          </p>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              style={{
                width: "10px",
                height: "10px",
                fill: i < Math.floor(product.rating) ? "#f97316" : "none",
                color:
                  i < Math.floor(product.rating)
                    ? "#f97316"
                    : "var(--border-medium)",
              }}
            />
          ))}
          <span
            style={{
              fontSize: "0.65rem",
              color: "var(--text-subtle)",
              marginLeft: "1px",
            }}
          >
            ({product.reviews?.length || 0})
          </span>
        </div>

        <div style={{ marginTop: "auto", paddingTop: "4px" }}>
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
                  color: "var(--brand)",
                  margin: 0,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {formatPrice(final)}
              </p>
              {product.discountPercentage > 0.5 && (
                <p
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-subtle)",
                    textDecoration: "line-through",
                    margin: 0,
                  }}
                >
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
            <button
              onClick={() => addItem(product)}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "var(--brand)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--brand-dark)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--brand)")
              }
            >
              <ShoppingCart
                style={{ width: "13px", height: "13px", color: "#fff" }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section header ── */
function SectionHeader({ title, subtitle, to, orange }) {
  return (
    <div
      style={{
        backgroundColor: orange ? "#f97316" : "var(--brand)",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "8px 8px 0 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h2
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "1rem",
            fontWeight: "800",
            color: "#fff",
            margin: 0,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.8)",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
      {to && (
        <Link
          to={to}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.75rem",
            fontWeight: "700",
            color: "#fff",
            textDecoration: "none",
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: "4px 10px",
            borderRadius: "99px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")
          }
        >
          See All <ChevronRight style={{ width: "13px", height: "13px" }} />
        </Link>
      )}
    </div>
  );
}

/* ── Horizontal scroll product row ── */
function ProductRow({ products, isLoading }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 220, behavior: "smooth" });
    }
  };

  if (isLoading)
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "1px",
          backgroundColor: "var(--border-light)",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{ backgroundColor: "var(--bg-card)", padding: "12px" }}
          >
            <div
              style={{
                aspectRatio: "1",
                marginBottom: "8px",
                borderRadius: "4px",
              }}
              className="shimmer-bg"
            />
            <div
              style={{
                height: "10px",
                width: "90%",
                marginBottom: "6px",
                borderRadius: "3px",
              }}
              className="shimmer-bg"
            />
            <div
              style={{ height: "14px", width: "50%", borderRadius: "3px" }}
              className="shimmer-bg"
            />
          </div>
        ))}
      </div>
    );

  return products?.length > 0 ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
        gap: "1px",
        backgroundColor: "var(--border-light)",
      }}
    >
      {products.map((p) => (
        <div
          key={p.id}
          style={{ backgroundColor: "var(--bg-card)", padding: "8px" }}
        >
          <MiniCard product={p} />
        </div>
      ))}
    </div>
  ) : null;
}

/* ── The main import ── */
import { useRef } from "react";

/* ── Banner carousel ── */
const BANNERS = [
  {
    bg: "linear-gradient(135deg, #1a3a1c 0%, #2d6b30 100%)",
    title: "Flash Sale",
    sub: "Up to 70% Off Electronics",
    cta: "Shop Now",
    to: "/flash-sale",
    emoji: "⚡",
  },
  {
    bg: "linear-gradient(135deg, #1a1a3a 0%, #2d2d8b 100%)",
    title: "New Arrivals",
    sub: "Fresh Fashion & Lifestyle",
    cta: "Explore",
    to: "/new-arrivals",
    emoji: "✨",
  },
  {
    bg: "linear-gradient(135deg, #3a1a1a 0%, #8b2d2d 100%)",
    title: "Supermarket",
    sub: "Groceries Delivered Fast",
    cta: "Shop Groceries",
    to: "/category/groceries",
    emoji: "🛒",
  },
];

function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % BANNERS.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);
  const b = BANNERS[current];
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        aspectRatio: "16/5",
        minHeight: "140px",
      }}
    >
      <div
        style={{
          background: b.bg,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "clamp(16px, 4vw, 40px)",
          transition: "background 0.5s",
          position: "absolute",
          inset: 0,
        }}
      >
        <div>
          <p
            style={{
              fontSize: "clamp(2rem, 8vw, 4rem)",
              marginBottom: "4px",
              lineHeight: 1,
            }}
          >
            {b.emoji}
          </p>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.1rem, 3vw, 2rem)",
              color: "#fff",
              fontWeight: "700",
              marginBottom: "4px",
            }}
          >
            {b.title}
          </h2>
          <p
            style={{
              fontSize: "clamp(0.72rem, 2vw, 0.95rem)",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "14px",
            }}
          >
            {b.sub}
          </p>
          <Link
            to={b.to}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#fff",
              color: "#141414",
              fontSize: "0.78rem",
              fontWeight: "800",
              padding: "7px 16px",
              borderRadius: "4px",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {b.cta} →
          </Link>
        </div>
      </div>
      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "14px",
          display: "flex",
          gap: "5px",
        }}
      >
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? "18px" : "6px",
              height: "6px",
              borderRadius: "99px",
              backgroundColor: "#fff",
              opacity: i === current ? 1 : 0.4,
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
      {/* Arrows */}
      <button
        onClick={() =>
          setCurrent((c) => (c - 1 + BANNERS.length) % BANNERS.length)
        }
        style={{
          position: "absolute",
          left: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.25)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <ChevronLeft style={{ width: "16px", height: "16px" }} />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % BANNERS.length)}
        style={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.25)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <ChevronRight style={{ width: "16px", height: "16px" }} />
      </button>
    </div>
  );
}

export default function HomePage() {
  const { h, m, s } = useCountdown(12);
  const { data: featured, isLoading: fl } = useFeaturedProducts(20);
  const { data: newArrivals, isLoading: nl } = useNewArrivals();
  const { data: bestSellers, isLoading: bl } = useBestSellers();
  const { data: electronics, isLoading: el } = useProductsByCategory(
    "smartphones",
    10,
  );
  const { data: fashion, isLoading: fal } = useProductsByCategory("tops", 10);
  const { data: skincare, isLoading: sl } = useProductsByCategory(
    "skincare",
    10,
  );

  const catScrollRef = useRef(null);
  const scrollCats = (dir) =>
    catScrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });

  /* ── Deals of the day (highest discount) ── */
  const deals = [...(featured || [])]
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 10);

  return (
    <div style={{ backgroundColor: "var(--bg-section)", minHeight: "100vh" }}>
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "8px 12px" }}
      >
        {/* ═══════════════════════════════════════
            CATEGORY ICON BAR  (like Jumia top row)
        ═══════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "8px",
            padding: "12px 8px",
            marginBottom: "8px",
            position: "relative",
            border: "1px solid var(--border-light)",
          }}
        >
          <button
            onClick={() => scrollCats(-1)}
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "24px",
              height: "100%",
              backgroundColor: "var(--bg-card)",
              border: "none",
              cursor: "pointer",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              borderRadius: "8px 0 0 8px",
              boxShadow: "4px 0 8px rgba(0,0,0,0.06)",
            }}
          >
            <ChevronLeft style={{ width: "14px", height: "14px" }} />
          </button>

          <div
            ref={catScrollRef}
            style={{
              display: "flex",
              gap: "4px",
              overflowX: "auto",
              scrollbarWidth: "none",
              padding: "0 20px",
            }}
          >
            <style>{`.cat-scroll::-webkit-scrollbar{display:none}`}</style>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  minWidth: "fit-content",
                  transition: "background-color 0.15s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--brand-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "var(--bg-section)",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                  }}
                >
                  {cat.icon}
                </div>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-secondary)",
                    fontWeight: "500",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scrollCats(1)}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "24px",
              height: "100%",
              backgroundColor: "var(--bg-card)",
              border: "none",
              cursor: "pointer",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              borderRadius: "0 8px 8px 0",
              boxShadow: "-4px 0 8px rgba(0,0,0,0.06)",
            }}
          >
            <ChevronRight style={{ width: "14px", height: "14px" }} />
          </button>
        </div>

        {/* ═══════════════════════════════════════
            MAIN LAYOUT: Banner + Sidebar + Right
        ═══════════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "8px",
            marginBottom: "8px",
            alignItems: "start",
          }}
        >
          {/* Big banner */}
          <div style={{ gridColumn: "span 2" }} className="main-banner">
            <BannerCarousel />
          </div>

          {/* Right promo boxes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              {
                bg: "#fff8f0",
                border: "#f97316",
                title: "⚡ Flash Sale",
                sub: "Deals ending soon",
                to: "/flash-sale",
                badge: "HOT",
                badgeBg: "#ef4444",
              },
              {
                bg: "var(--brand-light)",
                border: "var(--brand-mid)",
                title: "✨ New Arrivals",
                sub: "Just dropped this week",
                to: "/new-arrivals",
                badge: "NEW",
                badgeBg: "var(--brand)",
              },
              {
                bg: "#f0f4ff",
                border: "#818cf8",
                title: "🔐 Secure Pay",
                sub: "Paystack protected",
                to: "/faq",
                badge: "100%",
                badgeBg: "#6366f1",
              },
            ].map((box, i) => (
              <Link
                key={i}
                to={box.to}
                style={{
                  display: "block",
                  textDecoration: "none",
                  backgroundColor: box.bg,
                  border: `1px solid ${box.border}`,
                  borderRadius: "8px",
                  padding: "12px 14px",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: box.badgeBg,
                    color: "#fff",
                    fontSize: "0.55rem",
                    fontWeight: "800",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {box.badge}
                </span>
                <p
                  style={{
                    fontWeight: "800",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    margin: "0 0 2px",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {box.title}
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  {box.sub}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            DEALS OF THE DAY  (Jumia DOD section)
        ═══════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "8px",
            marginBottom: "8px",
            overflow: "hidden",
            border: "1px solid var(--border-light)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #f97316, #ea580c)",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "1rem",
                  fontWeight: "800",
                  color: "#fff",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Zap style={{ width: "16px", height: "16px", fill: "#fff" }} />{" "}
                Deals of the Day
              </h2>
              {/* Countdown */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Clock
                  style={{
                    width: "13px",
                    height: "13px",
                    color: "rgba(255,255,255,0.8)",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.8)",
                    marginRight: "4px",
                  }}
                >
                  Ends in:
                </span>
                {[h, m, s].map((val, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        color: "#fff",
                        fontWeight: "800",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.82rem",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        minWidth: "26px",
                        textAlign: "center",
                      }}
                    >
                      {val}
                    </span>
                    {i < 2 && (
                      <span
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontWeight: "700",
                          fontSize: "0.9rem",
                          margin: "0 1px",
                        }}
                      >
                        :
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/flash-sale"
              style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                color: "#fff",
                textDecoration: "none",
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "4px 12px",
                borderRadius: "99px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              See All <ChevronRight style={{ width: "13px", height: "13px" }} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 150px), 1fr))",
              gap: "1px",
              backgroundColor: "var(--border-light)",
            }}
          >
            {fl
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1",
                        marginBottom: "8px",
                        borderRadius: "4px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "10px",
                        width: "80%",
                        marginBottom: "5px",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "14px",
                        width: "50%",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                  </div>
                ))
              : deals.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "8px",
                    }}
                  >
                    <MiniCard product={p} />
                  </div>
                ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            PROMO BANNERS ROW  (3 across)
        ═══════════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          {[
            {
              bg: "linear-gradient(135deg, #064e3b, #047857)",
              emoji: "📱",
              title: "Electronics",
              sub: "Up to 50% off",
              to: "/category/smartphones",
            },
            {
              bg: "linear-gradient(135deg, #4c1d95, #6d28d9)",
              emoji: "👗",
              title: "Fashion Week",
              sub: "New styles daily",
              to: "/category/tops",
            },
            {
              bg: "linear-gradient(135deg, #7c2d12, #c2410c)",
              emoji: "🏠",
              title: "Home & Living",
              sub: "Make it yours",
              to: "/category/home-decoration",
            },
          ].map((b, i) => (
            <Link
              key={i}
              to={b.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: b.bg,
                borderRadius: "8px",
                padding: "16px",
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "none";
              }}
            >
              <span style={{ fontSize: "2.2rem" }}>{b.emoji}</span>
              <div>
                <p
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: "800",
                    color: "#fff",
                    margin: "0 0 2px",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {b.title}
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.75)",
                    margin: 0,
                  }}
                >
                  {b.sub}
                </p>
              </div>
              <ChevronRight
                style={{
                  width: "16px",
                  height: "16px",
                  color: "rgba(255,255,255,0.6)",
                  marginLeft: "auto",
                }}
              />
            </Link>
          ))}
        </div>

        {/* ═══════════════════════════════════════
            FEATURED PRODUCTS (big grid)
        ═══════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "8px",
            marginBottom: "8px",
            overflow: "hidden",
            border: "1px solid var(--border-light)",
          }}
        >
          <SectionHeader
            title="🔥 Best Sellers"
            subtitle="Top picks this week"
            to="/category/smartphones"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 150px), 1fr))",
              gap: "1px",
              backgroundColor: "var(--border-light)",
            }}
          >
            {bl
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1",
                        marginBottom: "8px",
                        borderRadius: "4px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "10px",
                        width: "80%",
                        marginBottom: "5px",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "14px",
                        width: "50%",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                  </div>
                ))
              : bestSellers?.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "8px",
                    }}
                  >
                    <MiniCard product={p} />
                  </div>
                ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            ELECTRONICS SECTION
        ═══════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "8px",
            marginBottom: "8px",
            overflow: "hidden",
            border: "1px solid var(--border-light)",
          }}
        >
          <SectionHeader
            title="📱 Electronics"
            subtitle="Phones, Laptops & More"
            to="/category/smartphones"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 150px), 1fr))",
              gap: "1px",
              backgroundColor: "var(--border-light)",
            }}
          >
            {el
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1",
                        marginBottom: "8px",
                        borderRadius: "4px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "10px",
                        width: "80%",
                        marginBottom: "5px",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "14px",
                        width: "50%",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                  </div>
                ))
              : electronics?.products?.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "8px",
                    }}
                  >
                    <MiniCard product={p} />
                  </div>
                ))}
          </div>
          <div
            style={{
              padding: "12px",
              backgroundColor: "var(--bg-section)",
              borderTop: "1px solid var(--border-light)",
              textAlign: "center",
            }}
          >
            <Link
              to="/category/smartphones"
              className="btn-outline"
              style={{
                borderRadius: "4px",
                fontSize: "0.78rem",
                padding: "7px 24px",
              }}
            >
              View All Electronics{" "}
              <ChevronRight style={{ width: "13px", height: "13px" }} />
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            MID BANNER — New Arrivals
        ═══════════════════════════════════════ */}
        <Link
          to="/new-arrivals"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
            borderRadius: "8px",
            padding: "clamp(14px, 3vw, 24px) clamp(16px, 4vw, 32px)",
            textDecoration: "none",
            marginBottom: "8px",
            transition: "opacity 0.2s",
            flexWrap: "wrap",
            gap: "12px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <div>
            <p
              style={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "4px",
                fontWeight: "700",
              }}
            >
              Just Landed
            </p>
            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.1rem, 3vw, 1.75rem)",
                color: "#fff",
                fontWeight: "700",
                marginBottom: "6px",
              }}
            >
              New Arrivals Are Here ✨
            </h3>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)" }}>
              Fresh products added to the store every week
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#fff",
              color: "var(--brand)",
              padding: "10px 20px",
              borderRadius: "4px",
              fontWeight: "800",
              fontSize: "0.82rem",
              flexShrink: 0,
            }}
          >
            Shop Now <ArrowRight style={{ width: "15px", height: "15px" }} />
          </div>
        </Link>

        {/* ═══════════════════════════════════════
            FASHION SECTION
        ═══════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "8px",
            marginBottom: "8px",
            overflow: "hidden",
            border: "1px solid var(--border-light)",
          }}
        >
          <SectionHeader
            title="👕 Fashion"
            subtitle="Tops, Shirts, Shoes & More"
            to="/category/tops"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 150px), 1fr))",
              gap: "1px",
              backgroundColor: "var(--border-light)",
            }}
          >
            {fal
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1",
                        marginBottom: "8px",
                        borderRadius: "4px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "10px",
                        width: "80%",
                        marginBottom: "5px",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "14px",
                        width: "50%",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                  </div>
                ))
              : fashion?.products?.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "8px",
                    }}
                  >
                    <MiniCard product={p} />
                  </div>
                ))}
          </div>
          <div
            style={{
              padding: "12px",
              backgroundColor: "var(--bg-section)",
              borderTop: "1px solid var(--border-light)",
              textAlign: "center",
            }}
          >
            <Link
              to="/category/tops"
              className="btn-outline"
              style={{
                borderRadius: "4px",
                fontSize: "0.78rem",
                padding: "7px 24px",
              }}
            >
              View All Fashion{" "}
              <ChevronRight style={{ width: "13px", height: "13px" }} />
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            SKINCARE SECTION
        ═══════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "8px",
            marginBottom: "8px",
            overflow: "hidden",
            border: "1px solid var(--border-light)",
          }}
        >
          <SectionHeader
            title="✨ Beauty & Skincare"
            subtitle="Glow up your routine"
            to="/category/skincare"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 150px), 1fr))",
              gap: "1px",
              backgroundColor: "var(--border-light)",
            }}
          >
            {sl
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1",
                        marginBottom: "8px",
                        borderRadius: "4px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "10px",
                        width: "80%",
                        marginBottom: "5px",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "14px",
                        width: "50%",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                  </div>
                ))
              : skincare?.products?.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "8px",
                    }}
                  >
                    <MiniCard product={p} />
                  </div>
                ))}
          </div>
          <div
            style={{
              padding: "12px",
              backgroundColor: "var(--bg-section)",
              borderTop: "1px solid var(--border-light)",
              textAlign: "center",
            }}
          >
            <Link
              to="/category/skincare"
              className="btn-outline"
              style={{
                borderRadius: "4px",
                fontSize: "0.78rem",
                padding: "7px 24px",
              }}
            >
              View All Skincare{" "}
              <ChevronRight style={{ width: "13px", height: "13px" }} />
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            NEW ARRIVALS SECTION
        ═══════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "8px",
            marginBottom: "8px",
            overflow: "hidden",
            border: "1px solid var(--border-light)",
          }}
        >
          <SectionHeader
            title="🆕 New Arrivals"
            subtitle="Added this week"
            to="/new-arrivals"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 150px), 1fr))",
              gap: "1px",
              backgroundColor: "var(--border-light)",
            }}
          >
            {nl
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1",
                        marginBottom: "8px",
                        borderRadius: "4px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "10px",
                        width: "80%",
                        marginBottom: "5px",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                    <div
                      style={{
                        height: "14px",
                        width: "50%",
                        borderRadius: "3px",
                      }}
                      className="shimmer-bg"
                    />
                  </div>
                ))
              : newArrivals?.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "8px",
                    }}
                  >
                    <MiniCard product={p} />
                  </div>
                ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            BOTTOM TRUST BAR  (like Jumia footer strip)
        ═══════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
              gap: "16px",
            }}
          >
            {[
              {
                icon: (
                  <Truck
                    style={{
                      width: "22px",
                      height: "22px",
                      color: "var(--brand)",
                    }}
                  />
                ),
                title: "Nationwide Delivery",
                sub: "2–7 business days",
              },
              {
                icon: (
                  <Shield
                    style={{
                      width: "22px",
                      height: "22px",
                      color: "var(--brand)",
                    }}
                  />
                ),
                title: "Buyer Protection",
                sub: "100% secure payment",
              },
              {
                icon: (
                  <RotateCcw
                    style={{
                      width: "22px",
                      height: "22px",
                      color: "var(--brand)",
                    }}
                  />
                ),
                title: "Easy Returns",
                sub: "30-day return policy",
              },
              {
                icon: (
                  <Headphones
                    style={{
                      width: "22px",
                      height: "22px",
                      color: "var(--brand)",
                    }}
                  />
                ),
                title: "24/7 Support",
                sub: "Help when you need it",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "4px 0",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "var(--brand-light)",
                    border: "1px solid var(--brand-mid)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
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
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            NEWSLETTER STRIP
        ═══════════════════════════════════════ */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a3a1c, #2d5a30)",
            borderRadius: "8px",
            padding: "clamp(16px, 3vw, 24px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "8px",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
                color: "#fff",
                margin: "0 0 4px",
                fontWeight: "700",
              }}
            >
              🎉 Get exclusive deals in your inbox!
            </h3>
            <p
              style={{
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.7)",
                margin: 0,
              }}
            >
              Subscribe and never miss a flash sale or new arrival
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0",
              flexShrink: 0,
              width: "min(100%, 340px)",
            }}
          >
            <input
              type="email"
              placeholder="Enter your email..."
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "4px 0 0 4px",
                padding: "10px 14px",
                fontSize: "0.85rem",
                outline: "none",
                color: "#141414",
              }}
            />
            <button
              style={{
                backgroundColor: "#f97316",
                color: "#fff",
                border: "none",
                borderRadius: "0 4px 4px 0",
                padding: "10px 18px",
                fontSize: "0.8rem",
                fontWeight: "800",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#ea580c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#f97316")
              }
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Responsive: hide right promo boxes on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .main-banner { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  );
}
