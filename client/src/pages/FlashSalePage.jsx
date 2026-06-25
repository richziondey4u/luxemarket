import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Clock, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useFeaturedProducts } from "../hooks/useProducts.js";
import ProductCard from "../components/product/ProductCard.jsx";
import ProductSkeleton from "../components/product/ProductSkeleton.jsx";

/* ── Countdown ── */
function useCountdown(hours = 8) {
  const getMs = () => {
    const saved = sessionStorage.getItem("flash_end");
    if (saved) {
      const diff = parseInt(saved) - Date.now();
      if (diff > 0) return diff;
    }
    const end = Date.now() + hours * 3_600_000;
    sessionStorage.setItem("flash_end", end.toString());
    return hours * 3_600_000;
  };
  const [ms, setMs] = useState(getMs);
  useEffect(() => {
    const t = setInterval(() => setMs((p) => (p <= 1000 ? 0 : p - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    h: String(Math.floor(ms / 3_600_000)).padStart(2, "0"),
    m: String(Math.floor((ms % 3_600_000) / 60_000)).padStart(2, "0"),
    s: String(Math.floor((ms % 60_000) / 1000)).padStart(2, "0"),
    expired: ms === 0,
  };
}

function TimeBlock({ value, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
          borderRadius: "6px",
          padding: "6px 12px",
          minWidth: "52px",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "1.5rem",
          fontWeight: "800",
          color: "#fff",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <p
        style={{
          fontSize: "0.6rem",
          color: "rgba(255,255,255,0.65)",
          marginTop: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
    </div>
  );
}

const DISCOUNT_TABS = [
  { label: "All Deals", min: 0 },
  { label: "10%+ Off", min: 10 },
  { label: "20%+ Off", min: 20 },
  { label: "30%+ Off", min: 30 },
];

const SORT_OPTIONS = [
  { value: "discount", label: "Biggest Discount" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
];

export default function FlashSalePage() {
  const { h, m, s, expired } = useCountdown(8);
  const { data: products = [], isLoading } = useFeaturedProducts(30);

  const [minDiscount, setMinDiscount] = useState(0);
  const [sort, setSort] = useState("discount");

  const saleProducts = [...products]
    .filter(
      (p) => p.discountPercentage >= minDiscount && p.discountPercentage > 0,
    )
    .sort((a, b) => {
      if (sort === "discount")
        return b.discountPercentage - a.discountPercentage;
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return b.rating - a.rating;
    });

  return (
    <div style={{ backgroundColor: "var(--bg-section)", minHeight: "100vh" }}>
      {/* ── Hero banner ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1a0a00 0%, #7c1d00 50%, #c2410c 100%)",
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
            opacity: 0.07,
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />

        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            backgroundColor: "rgba(251,146,60,0.2)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            position: "relative",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "rgba(251,146,60,0.25)",
              border: "1px solid rgba(251,146,60,0.5)",
              borderRadius: "99px",
              padding: "5px 14px",
              marginBottom: "16px",
            }}
          >
            <Zap
              style={{
                width: "12px",
                height: "12px",
                color: "#fb923c",
                fill: "#fb923c",
              }}
            />
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: "800",
                color: "#fb923c",
                letterSpacing: "0.1em",
              }}
            >
              LIMITED TIME OFFER
            </span>
          </div>

          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: "700",
              color: "#fff",
              marginBottom: "8px",
              lineHeight: 1.2,
            }}
          >
            ⚡ Flash Sale
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "clamp(0.82rem, 2vw, 1rem)",
              marginBottom: "28px",
            }}
          >
            Massive discounts — grab them before time runs out!
          </p>

          {/* Countdown */}
          {expired ? (
            <div
              style={{
                display: "inline-block",
                backgroundColor: "rgba(239,68,68,0.25)",
                border: "1px solid rgba(239,68,68,0.5)",
                borderRadius: "10px",
                padding: "10px 24px",
                color: "#fca5a5",
                fontWeight: "700",
                fontSize: "0.9rem",
              }}
            >
              ⏰ Sale has ended — check back soon!
            </div>
          ) : (
            <div>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.72rem",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                <Clock
                  style={{
                    width: "11px",
                    height: "11px",
                    display: "inline",
                    marginRight: "4px",
                  }}
                />
                Sale ends in
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <TimeBlock value={h} label="Hours" />
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: "#fb923c",
                    marginTop: "6px",
                  }}
                >
                  :
                </span>
                <TimeBlock value={m} label="Minutes" />
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: "#fb923c",
                    marginTop: "6px",
                  }}
                >
                  :
                </span>
                <TimeBlock value={s} label="Seconds" />
              </div>
            </div>
          )}

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              marginTop: "28px",
              flexWrap: "wrap",
            }}
          >
            {[
              { v: `${saleProducts.length}+`, l: "Products on Sale" },
              { v: "Up to 70%", l: "Discount" },
              { v: "Free", l: "Delivery over ₦50k" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: "1rem",
                    fontFamily: "DM Sans, sans-serif",
                    margin: "0 0 2px",
                  }}
                >
                  {s.v}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.72rem",
                    margin: 0,
                  }}
                >
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderBottom: "1px solid var(--border-light)",
          position: "sticky",
          top: "60px",
          zIndex: 40,
          padding: "10px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {/* Discount tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {DISCOUNT_TABS.map((tab) => (
              <button
                key={tab.min}
                onClick={() => setMinDiscount(tab.min)}
                style={{
                  padding: "5px 14px",
                  borderRadius: "99px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  border: "1.5px solid",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  backgroundColor:
                    minDiscount === tab.min ? "#f97316" : "var(--bg-muted)",
                  borderColor:
                    minDiscount === tab.min
                      ? "#f97316"
                      : "var(--border-medium)",
                  color:
                    minDiscount === tab.min ? "#fff" : "var(--text-secondary)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort + count */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                {saleProducts.length}
              </span>{" "}
              deals
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                border: "1px solid var(--border-medium)",
                borderRadius: "6px",
                fontSize: "0.75rem",
                padding: "5px 10px",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
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
        ) : saleProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 16px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
            }}
          >
            <p style={{ fontSize: "2.5rem", marginBottom: "10px" }}>😔</p>
            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.15rem",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              No deals at this discount level
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                marginBottom: "14px",
              }}
            >
              Try a lower discount filter to see more products
            </p>
            <button
              onClick={() => setMinDiscount(0)}
              className="btn-outline"
              style={{ borderRadius: "6px", fontSize: "0.8rem" }}
            >
              Show All Deals
            </button>
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
            {/* Section header */}
            <div
              style={{
                background: "linear-gradient(90deg, #f97316, #ea580c)",
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
                <Zap style={{ width: "15px", height: "15px", fill: "#fff" }} />
                Flash Deals · {saleProducts.length} items
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
                Keep Shopping →
              </Link>
            </div>

            {/* Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
                gap: "1px",
                backgroundColor: "var(--border-light)",
              }}
            >
              {saleProducts.map((p) => (
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

        {/* Bottom CTA */}
        {!isLoading && saleProducts.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                marginBottom: "12px",
              }}
            >
              Want to see more deals?
            </p>
            <Link
              to="/"
              className="btn-primary"
              style={{ borderRadius: "6px" }}
            >
              Browse All Products{" "}
              <ChevronRight style={{ width: "15px", height: "15px" }} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
