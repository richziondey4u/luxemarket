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
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <div
        style={{
          borderBottom: "1px solid #ebebeb",
          backgroundColor: "#f9f9f9",
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{ color: "#757575", display: "flex", alignItems: "center" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#4f7d52")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#757575")}
          >
            <ArrowLeft style={{ width: "18px", height: "18px" }} />
          </Link>
          <div>
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                fontWeight: "700",
                color: "#141414",
              }}
            >
              Search Results
            </h1>
            <p
              style={{ fontSize: "0.8rem", color: "#757575", marginTop: "2px" }}
            >
              {isLoading ? "Searching..." : `${results?.length || 0} results`}
              {!isLoading && query && (
                <span style={{ color: "#4f7d52", fontWeight: "500" }}>
                  {" "}
                  for "{query}"
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "28px 16px 64px",
        }}
      >
        {!query && (
          <div style={{ textAlign: "center", padding: "80px 16px" }}>
            <Search
              style={{
                width: "48px",
                height: "48px",
                color: "#c8c8c8",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ color: "#a0a0a0", fontSize: "1rem" }}>
              Enter a search term to find products
            </p>
          </div>
        )}
        {query && isLoading && <ProductSkeleton count={8} />}
        {query && !isLoading && results?.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 16px" }}>
            <Search
              style={{
                width: "48px",
                height: "48px",
                color: "#c8c8c8",
                margin: "0 auto 12px",
              }}
            />
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.5rem",
                color: "#141414",
                marginBottom: "8px",
              }}
            >
              No results found
            </h2>
            <p style={{ color: "#757575", marginBottom: "20px" }}>
              Try different keywords or browse our categories.
            </p>
            <Link
              to="/"
              className="btn-primary"
              style={{ borderRadius: "8px" }}
            >
              Back to Home
            </Link>
          </div>
        )}
        {results?.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
              gap: "16px",
            }}
          >
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
