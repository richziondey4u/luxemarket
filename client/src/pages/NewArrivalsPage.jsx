import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  TrendingUp,
  Star,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  useNewArrivals,
  useBestSellers,
  useFeaturedProducts,
} from "../hooks/useProducts.js";
import { CATEGORIES } from "../api/products.js";
import ProductCard from "../components/product/ProductCard.jsx";
import ProductSkeleton from "../components/product/ProductSkeleton.jsx";

const TABS = [
  { id: "all", label: "All New", icon: "✨" },
  { id: "trending", label: "Trending Now", icon: "🔥" },
  { id: "picks", label: "Editor Picks", icon: "⭐" },
];

export default function NewArrivalsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: newArrivals = [], isLoading: nl } = useNewArrivals();
  const { data: bestSellers = [], isLoading: bl } = useBestSellers();
  const { data: featured = [], isLoading: fl } = useFeaturedProducts(16);

  const tabData = {
    all: { products: newArrivals, loading: nl },
    trending: { products: bestSellers, loading: bl },
    picks: { products: featured, loading: fl },
  };

  const { products: current, loading: isLoading } = tabData[activeTab];

  return (
    <div style={{ backgroundColor: "var(--bg-section)", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)",
          padding: "clamp(28px, 5vw, 56px) 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            pointerEvents: "none",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "-60px",
            width: "260px",
            height: "260px",
            backgroundColor: "rgba(74,222,128,0.1)",
            borderRadius: "50%",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-60px",
            width: "220px",
            height: "220px",
            backgroundColor: "rgba(74,222,128,0.07)",
            borderRadius: "50%",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "32px",
              alignItems: "center",
            }}
          >
            {/* Left text */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(74,222,128,0.15)",
                  border: "1px solid rgba(74,222,128,0.3)",
                  borderRadius: "99px",
                  padding: "5px 14px",
                  marginBottom: "16px",
                }}
              >
                <Sparkles
                  style={{ width: "12px", height: "12px", color: "#4ade80" }}
                />
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: "800",
                    color: "#4ade80",
                    letterSpacing: "0.1em",
                  }}
                >
                  JUST ARRIVED
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.75rem, 5vw, 3rem)",
                  fontWeight: "700",
                  color: "#fff",
                  lineHeight: 1.15,
                  marginBottom: "12px",
                }}
              >
                New Arrivals
                <br />
                <span style={{ color: "#4ade80" }}>Fresh & Trending</span>
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "clamp(0.82rem, 2vw, 0.95rem)",
                  lineHeight: "1.7",
                  marginBottom: "20px",
                  maxWidth: "380px",
                }}
              >
                Discover the latest products added to our store. Fresh styles,
                new tech, and must-haves — updated weekly.
              </p>

              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {[
                  {
                    icon: (
                      <TrendingUp style={{ width: "13px", height: "13px" }} />
                    ),
                    text: "Updated weekly",
                  },
                  {
                    icon: (
                      <Star
                        style={{
                          width: "13px",
                          height: "13px",
                          fill: "#fbbf24",
                          color: "#fbbf24",
                        }}
                      />
                    ),
                    text: "Top rated picks",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span style={{ color: "#4ade80" }}>{item.icon}</span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: "500",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — category quick links */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {CATEGORIES.slice(0, 6).map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.15)";
                    e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.12)";
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{cat.icon}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: "600",
                        color: "#fff",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cat.label}
                    </p>
                    <p
                      style={{
                        fontSize: "0.62rem",
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                      }}
                    >
                      New items
                    </p>
                  </div>
                  <ChevronRight
                    style={{
                      width: "12px",
                      height: "12px",
                      color: "rgba(255,255,255,0.35)",
                      flexShrink: 0,
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderBottom: "1px solid var(--border-light)",
          position: "sticky",
          top: "60px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            gap: "0",
            overflowX: "auto",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "13px 20px",
                fontSize: "0.85rem",
                fontWeight: "600",
                border: "none",
                background: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.2s",
                borderBottom: `2.5px solid ${activeTab === tab.id ? "var(--brand)" : "transparent"}`,
                color:
                  activeTab === tab.id ? "var(--brand)" : "var(--text-muted)",
                marginBottom: "-1px",
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "12px 12px 56px",
        }}
      >
        {isLoading ? (
          <ProductSkeleton count={12} />
        ) : current.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 16px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "10px" }}>✨</p>
            <p style={{ color: "var(--text-muted)" }}>Loading products...</p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Section header bar */}
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
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Sparkles style={{ width: "15px", height: "15px" }} />
                {TABS.find((t) => t.id === activeTab)?.label} · {current.length}{" "}
                items
              </h2>
              <Link
                to="/"
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
                View All →
              </Link>
            </div>

            {/* Product grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
                gap: "1px",
                backgroundColor: "var(--border-light)",
              }}
            >
              {current.map((p) => (
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

      {/* ── Newsletter strip ── */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderTop: "1px solid var(--border-light)",
          padding: "clamp(24px, 4vw, 40px) 16px",
        }}
      >
        <div
          style={{ maxWidth: "540px", margin: "0 auto", textAlign: "center" }}
        >
          <Sparkles
            style={{
              width: "24px",
              height: "24px",
              color: "var(--brand)",
              margin: "0 auto 10px",
              display: "block",
            }}
          />
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
              fontWeight: "700",
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Be the First to Know
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginBottom: "18px",
              lineHeight: "1.6",
            }}
          >
            Get new arrivals straight to your inbox — before anyone else!
          </p>
          <div style={{ display: "flex", maxWidth: "380px", margin: "0 auto" }}>
            <input
              type="email"
              placeholder="Enter your email address"
              style={{
                flex: 1,
                minWidth: 0,
                padding: "10px 14px",
                border: "1.5px solid var(--border-medium)",
                borderRight: "none",
                borderRadius: "6px 0 0 6px",
                fontSize: "0.85rem",
                outline: "none",
                backgroundColor: "var(--bg-input)",
                color: "var(--text-primary)",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--brand)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border-medium)")
              }
            />
            <button
              className="btn-primary"
              style={{
                borderRadius: "0 6px 6px 0",
                padding: "10px 18px",
                whiteSpace: "nowrap",
                fontSize: "0.8rem",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
