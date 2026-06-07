import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useProductsByCategory } from "../hooks/useProducts.js";
import { getCategoryBySlug, CATEGORIES, formatPrice } from "../api/products.js";
import ProductCard from "../components/product/ProductCard.jsx";
import ProductSkeleton from "../components/product/ProductSkeleton.jsx";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Best Discount" },
];

const RATING_FILTERS = [
  { label: "All Ratings", min: 0 },
  { label: "4★ & above", min: 4 },
  { label: "4.5★ & above", min: 4.5 },
];

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);

  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch up to 100 products (DummyJSON max per category)
  const { data, isLoading, isError } = useProductsByCategory(slug, 100, 0);
  const all = data?.products || [];

  const filtered = all.filter(
    (p) => p.price <= maxPrice && p.rating >= minRating,
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "discount") return b.discountPercentage - a.discountPercentage;
    return 0;
  });

  if (!category)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "32px 16px",
          backgroundColor: "var(--bg-page)",
        }}
      >
        <p style={{ fontSize: "3rem", marginBottom: "12px" }}>🔍</p>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.5rem",
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          Category not found
        </h2>
        <Link
          to="/"
          className="btn-primary"
          style={{ marginTop: "16px", borderRadius: "6px" }}
        >
          Back to Home
        </Link>
      </div>
    );

  const Sidebar = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Price */}
      <div>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Price Range
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginBottom: "6px",
          }}
        >
          <span>₦0</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={2000}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          style={{ width: "100%", accentColor: "var(--brand)" }}
        />
      </div>

      {/* Rating */}
      <div>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Rating
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {RATING_FILTERS.map((r) => (
            <button
              key={r.min}
              onClick={() => setMinRating(r.min)}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: "6px",
                fontSize: "0.82rem",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                backgroundColor:
                  minRating === r.min ? "var(--brand-light)" : "transparent",
                color:
                  minRating === r.min
                    ? "var(--brand)"
                    : "var(--text-secondary)",
                fontWeight: minRating === r.min ? "600" : "400",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setMaxPrice(2000);
          setMinRating(0);
        }}
        style={{
          fontSize: "0.78rem",
          color: "var(--text-subtle)",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: "4px 0",
          textDecoration: "underline",
        }}
      >
        Clear all filters
      </button>
    </div>
  );

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
              fontSize: "0.78rem",
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
            <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>
              {category.label}
            </span>
          </nav>
        </div>
      </div>

      {/* Category banner */}
      <div
        style={{
          background: `linear-gradient(135deg, #1a3a1c, #2d5a30)`,
          padding: "clamp(16px, 3vw, 28px) clamp(16px, 4vw, 32px)",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            {category.icon}
          </span>
          <div>
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                fontWeight: "700",
                color: "#fff",
                marginBottom: "3px",
              }}
            >
              {category.label}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
              {isLoading
                ? "Loading..."
                : `${sorted.length} product${sorted.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 12px 40px" }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          {/* Desktop sidebar */}
          <aside
            className="cat-sidebar"
            style={{
              width: "200px",
              flexShrink: 0,
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              padding: "16px",
              position: "sticky",
              top: "80px",
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: "800",
                color: "var(--text-primary)",
                marginBottom: "14px",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Filters
            </p>
            <Sidebar />
          </aside>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "8px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "8px",
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
                {/* Mobile filter btn */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="cat-filter-btn"
                  style={{
                    display: "none",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    backgroundColor: "var(--bg-muted)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  <SlidersHorizontal
                    style={{ width: "13px", height: "13px" }}
                  />{" "}
                  Filters
                </button>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  <span
                    style={{ fontWeight: "700", color: "var(--text-primary)" }}
                  >
                    {sorted.length}
                  </span>{" "}
                  results
                </p>
              </div>

              {/* Sort */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sort:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{
                    border: "1px solid var(--border-medium)",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    padding: "6px 10px",
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

            {/* Products */}
            {isLoading && <ProductSkeleton count={12} />}

            {isError && (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 16px",
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-light)",
                }}
              >
                <p style={{ fontSize: "2rem", marginBottom: "10px" }}>😕</p>
                <p style={{ color: "var(--text-muted)" }}>
                  Failed to load products. Please refresh.
                </p>
              </div>
            )}

            {!isLoading && !isError && sorted.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "64px 16px",
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-light)",
                }}
              >
                <p style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🔍</p>
                <p style={{ color: "var(--text-muted)", marginBottom: "14px" }}>
                  No products match your filters.
                </p>
                <button
                  onClick={() => {
                    setMaxPrice(2000);
                    setMinRating(0);
                  }}
                  className="btn-outline"
                  style={{ borderRadius: "6px", fontSize: "0.8rem" }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!isLoading && sorted.length > 0 && (
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
                    gap: "1px",
                    backgroundColor: "var(--border-light)",
                  }}
                >
                  {sorted.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        backgroundColor: "var(--bg-card)",
                        padding: "8px",
                      }}
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* More categories */}
      <div
        style={{
          borderTop: "1px solid var(--border-light)",
          backgroundColor: "var(--bg-card)",
          padding: "20px 16px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.82rem",
              fontWeight: "700",
              color: "var(--text-secondary)",
              marginBottom: "12px",
            }}
          >
            Browse Other Categories
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CATEGORIES.filter((c) => c.slug !== slug).map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 12px",
                  backgroundColor: "var(--bg-section)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "99px",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand-mid)";
                  e.currentTarget.style.color = "var(--brand)";
                  e.currentTarget.style.backgroundColor = "var(--brand-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-light)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.backgroundColor = "var(--bg-section)";
                }}
              >
                <span>{cat.icon}</span> {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <>
          <div
            onClick={() => setShowFilters(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 200,
            }}
          />
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              width: "260px",
              zIndex: 201,
              backgroundColor: "var(--bg-card)",
              padding: "20px",
              overflowY: "auto",
              boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  margin: 0,
                }}
              >
                Filters
              </p>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>
            <Sidebar />
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 640px) {
          .cat-sidebar    { display: none !important; }
          .cat-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
