import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
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

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError } = useProductsByCategory(slug, 30);
  const all = data?.products || [];

  const sorted = [...all]
    .filter((p) => p.price <= maxPrice && p.rating >= minRating)
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "discount")
        return b.discountPercentage - a.discountPercentage;
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
          padding: "24px",
        }}
      >
        <p style={{ fontSize: "3rem", marginBottom: "12px" }}>🔍</p>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.5rem",
            color: "#141414",
            marginBottom: "8px",
          }}
        >
          Category not found
        </h2>
        <Link to="/" className="btn-primary" style={{ marginTop: "16px" }}>
          Back to Home
        </Link>
      </div>
    );

  const Sidebar = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Price */}
      <div>
        <h4
          style={{
            fontSize: "0.82rem",
            fontWeight: "700",
            color: "#141414",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Max Price
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            color: "#757575",
            marginBottom: "8px",
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
          style={{ width: "100%", accentColor: "#4f7d52" }}
        />
      </div>
      {/* Rating */}
      <div>
        <h4
          style={{
            fontSize: "0.82rem",
            fontWeight: "700",
            color: "#141414",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Min Rating
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              style={{
                textAlign: "left",
                padding: "8px 12px",
                borderRadius: "7px",
                fontSize: "0.82rem",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                backgroundColor: minRating === r ? "#f4f7f4" : "transparent",
                color: minRating === r ? "#4f7d52" : "#555",
                fontWeight: minRating === r ? "600" : "400",
              }}
            >
              {r === 0 ? "All Ratings" : `${r}★ & above`}
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
          fontSize: "0.8rem",
          color: "#a0a0a0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: "4px 0",
        }}
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: "1px solid #ebebeb",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "12px 16px" }}
        >
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.8rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              style={{ color: "#757575", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4f7d52")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#757575")}
            >
              Home
            </Link>
            <ChevronRight
              style={{ width: "13px", height: "13px", color: "#c8c8c8" }}
            />
            <span style={{ color: "#242424", fontWeight: "500" }}>
              {category.label}
            </span>
          </nav>
        </div>
      </div>

      {/* Category hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${category.color.includes("blue") ? "#eff6ff" : "#f4f7f4"}, #f9f9f9)`,
          borderBottom: "1px solid #ebebeb",
          padding: "clamp(28px, 5vw, 48px) 16px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <span
            style={{
              fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
              display: "block",
              marginBottom: "10px",
            }}
          >
            {category.icon}
          </span>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: "700",
              color: "#141414",
              marginBottom: "6px",
            }}
          >
            {category.label}
          </h1>
          <p style={{ color: "#757575", fontSize: "0.9rem" }}>
            {data?.total || sorted.length} products available
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 16px 64px",
        }}
      >
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {/* Desktop sidebar */}
          <aside
            style={{
              width: "220px",
              flexShrink: 0,
              backgroundColor: "#fff",
              border: "1px solid #ebebeb",
              borderRadius: "12px",
              padding: "20px",
            }}
            className="cat-sidebar"
          >
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: "700",
                color: "#141414",
                marginBottom: "16px",
              }}
            >
              Filters
            </h3>
            <Sidebar />
          </aside>

          {/* Products */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <button
                  onClick={() => setShowFilters(true)}
                  className="cat-filter-btn"
                  style={{
                    display: "none",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    backgroundColor: "#fff",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: "7px",
                    fontSize: "0.82rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    color: "#3a3a3a",
                  }}
                >
                  <SlidersHorizontal
                    style={{ width: "15px", height: "15px" }}
                  />{" "}
                  Filters
                </button>
                <p style={{ fontSize: "0.82rem", color: "#757575" }}>
                  <span style={{ color: "#141414", fontWeight: "600" }}>
                    {sorted.length}
                  </span>{" "}
                  products
                </p>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  backgroundColor: "#fff",
                  border: "1.5px solid #e0e0e0",
                  color: "#3a3a3a",
                  fontSize: "0.82rem",
                  borderRadius: "7px",
                  padding: "8px 12px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {isLoading && <ProductSkeleton count={8} />}
            {isError && (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "#757575",
                }}
              >
                Failed to load products.
              </div>
            )}
            {!isLoading && !isError && sorted.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 16px" }}>
                <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</p>
                <p style={{ color: "#757575", marginBottom: "16px" }}>
                  No products match your filters.
                </p>
                <button
                  onClick={() => {
                    setMaxPrice(2000);
                    setMinRating(0);
                  }}
                  className="btn-outline"
                  style={{ fontSize: "0.82rem" }}
                >
                  Clear Filters
                </button>
              </div>
            )}
            {!isLoading && sorted.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(100%, 190px), 1fr))",
                  gap: "16px",
                }}
              >
                {sorted.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
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
              backgroundColor: "rgb(0 0 0 / 0.3)",
              zIndex: 200,
            }}
          />
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              width: "280px",
              zIndex: 201,
              backgroundColor: "#fff",
              padding: "20px",
              overflowY: "auto",
              boxShadow: "4px 0 24px rgb(0 0 0 / 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#141414",
                }}
              >
                Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                <X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>
            <Sidebar />
          </div>
        </>
      )}

      {/* More categories */}
      <div
        style={{
          borderTop: "1px solid #ebebeb",
          backgroundColor: "#f9f9f9",
          padding: "40px 16px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#141414",
              marginBottom: "16px",
            }}
          >
            More Categories
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CATEGORIES.filter((c) => c.slug !== slug).map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "99px",
                  fontSize: "0.8rem",
                  color: "#3a3a3a",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#4f7d52";
                  e.currentTarget.style.color = "#4f7d52";
                  e.currentTarget.style.backgroundColor = "#f4f7f4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                  e.currentTarget.style.color = "#3a3a3a";
                  e.currentTarget.style.backgroundColor = "#fff";
                }}
              >
                <span>{cat.icon}</span> {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .cat-sidebar    { display: none !important; }
          .cat-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
