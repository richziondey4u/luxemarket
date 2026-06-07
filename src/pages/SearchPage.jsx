import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { useSearchProducts } from "../hooks/useProducts.js";
import ProductCard from "../components/product/ProductCard.jsx";
import ProductSkeleton from "../components/product/ProductSkeleton.jsx";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data: results, isLoading } = useSearchProducts(query);

  return (
    <div style={{ backgroundColor: "var(--bg-section)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            <ArrowLeft style={{ width: "18px", height: "18px" }} />
          </Link>
          <div>
            <h1
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "1rem",
                fontWeight: "800",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Search Results
            </h1>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                margin: 0,
                marginTop: "1px",
              }}
            >
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  <span
                    style={{ fontWeight: "700", color: "var(--text-primary)" }}
                  >
                    {results?.length || 0}
                  </span>{" "}
                  result{results?.length !== 1 ? "s" : ""}
                  {query && (
                    <>
                      {" "}
                      for{" "}
                      <span
                        style={{ color: "var(--brand)", fontWeight: "600" }}
                      >
                        "{query}"
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "12px 12px 48px",
        }}
      >
        {/* No query */}
        {!query && (
          <div style={{ textAlign: "center", padding: "80px 16px" }}>
            <Search
              style={{
                width: "48px",
                height: "48px",
                color: "var(--text-subtle)",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
              Enter a search term to find products
            </p>
          </div>
        )}

        {/* Loading */}
        {query && isLoading && <ProductSkeleton count={10} />}

        {/* No results */}
        {query && !isLoading && results?.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 16px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
            }}
          >
            <Search
              style={{
                width: "40px",
                height: "40px",
                color: "var(--text-subtle)",
                margin: "0 auto 12px",
              }}
            />
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.25rem",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              No results for "{query}"
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "20px",
                fontSize: "0.875rem",
              }}
            >
              Try different keywords or browse our categories
            </p>
            <Link
              to="/"
              className="btn-primary"
              style={{ borderRadius: "6px" }}
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* Results */}
        {results?.length > 0 && (
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
              {results.map((p) => (
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
