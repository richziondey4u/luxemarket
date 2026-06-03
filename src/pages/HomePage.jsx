import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Shield,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  useFeaturedProducts,
  useNewArrivals,
  useBestSellers,
} from "../hooks/useProducts.js";
import ProductCard from "../components/product/ProductCard.jsx";
import ProductSkeleton from "../components/product/ProductSkeleton.jsx";
import { CATEGORIES } from "../api/products.js";

const PERKS = [
  {
    icon: <Truck style={{ width: "20px", height: "20px" }} />,
    title: "Free Shipping",
    desc: "On orders over ₦50,000",
  },
  {
    icon: <Shield style={{ width: "20px", height: "20px" }} />,
    title: "Secure Payment",
    desc: "Paystack encrypted",
  },
  {
    icon: <RotateCcw style={{ width: "20px", height: "20px" }} />,
    title: "Easy Returns",
    desc: "30-day return policy",
  },
  {
    icon: <Zap style={{ width: "20px", height: "20px" }} />,
    title: "Fast Delivery",
    desc: "2–5 business days",
  },
];

export default function HomePage() {
  const { data: featured, isLoading: fl } = useFeaturedProducts(8);
  const { data: newArrivals, isLoading: nl } = useNewArrivals();
  const { data: bestSellers, isLoading: bl } = useBestSellers();

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          backgroundColor: "#f9f9f9",
          borderBottom: "1px solid #ebebeb",
          padding: "80px 0 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            backgroundColor: "rgb(79 125 82 / 0.05)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "64px",
              alignItems: "center",
            }}
          >
            {/* Text */}
            <div className="animate-fade-up">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#f4f7f4",
                  border: "1px solid #a3c4a5",
                  borderRadius: "99px",
                  padding: "6px 14px",
                  marginBottom: "24px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#4f7d52",
                    borderRadius: "50%",
                  }}
                  className="animate-pulse-slow"
                />
                <span
                  style={{
                    color: "#4f7d52",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                  }}
                >
                  NEW COLLECTION 2025
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                  fontWeight: "700",
                  color: "#141414",
                  lineHeight: "1.1",
                  marginBottom: "20px",
                }}
              >
                Discover
                <br />
                The Best
                <br />
                <span style={{ color: "#4f7d52" }}>Products</span>
              </h1>

              <p
                style={{
                  color: "#757575",
                  fontSize: "1rem",
                  lineHeight: "1.7",
                  maxWidth: "420px",
                  marginBottom: "36px",
                }}
              >
                Find top quality products at the best prices. Shop the latest
                collection and enjoy exclusive deals.
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link
                  to="/category/smartphones"
                  className="btn-primary"
                  style={{
                    fontSize: "0.8rem",
                    padding: "12px 28px",
                    borderRadius: "6px",
                  }}
                >
                  Shop Now{" "}
                  <ArrowRight style={{ width: "15px", height: "15px" }} />
                </Link>
                <Link
                  to="/category/tops"
                  className="btn-secondary"
                  style={{
                    fontSize: "0.8rem",
                    padding: "12px 28px",
                    borderRadius: "6px",
                  }}
                >
                  Explore{" "}
                  <ArrowRight style={{ width: "15px", height: "15px" }} />
                </Link>
              </div>

              {/* Perks row */}
              <div
                style={{
                  display: "flex",
                  gap: "28px",
                  marginTop: "48px",
                  paddingTop: "32px",
                  borderTop: "1px solid #ebebeb",
                  flexWrap: "wrap",
                }}
              >
                {PERKS.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        backgroundColor: "#f4f7f4",
                        border: "1px solid #a3c4a5",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4f7d52",
                        flexShrink: 0,
                      }}
                    >
                      {p.icon}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          color: "#242424",
                        }}
                      >
                        {p.title}
                      </p>
                      <p style={{ fontSize: "0.72rem", color: "#a0a0a0" }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image card */}
            <div style={{ position: "relative" }} className="hidden lg:block">
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  border: "1px solid #ebebeb",
                  boxShadow: "0 20px 60px rgb(0 0 0 / 0.08)",
                  overflow: "hidden",
                  aspectRatio: "4/5",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
                  alt="Featured"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Floating cards */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "-24px",
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: "1px solid #ebebeb",
                  padding: "14px 18px",
                  boxShadow: "0 8px 24px rgb(0 0 0 / 0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#f4f7f4",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Truck
                    style={{ width: "18px", height: "18px", color: "#4f7d52" }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      color: "#242424",
                    }}
                  >
                    Free Delivery
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "#a0a0a0" }}>
                    Orders over ₦50,000
                  </p>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "-16px",
                  backgroundColor: "#4f7d52",
                  borderRadius: "12px",
                  padding: "10px 18px",
                  boxShadow: "0 4px 16px rgb(79 125 82 / 0.3)",
                }}
              >
                <p
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                  }}
                >
                  🔥 Hot Deal
                </p>
              </div>

              {/* Social proof */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "-20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: "1px solid #ebebeb",
                  padding: "12px 16px",
                  boxShadow: "0 8px 24px rgb(0 0 0 / 0.1)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div style={{ display: "flex" }}>
                    {["🧑", "👩", "👨"].map((e, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "1.2rem",
                          marginLeft: i > 0 ? "-6px" : 0,
                        }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: "#242424",
                      }}
                    >
                      2K+
                    </p>
                    <p style={{ fontSize: "0.65rem", color: "#a0a0a0" }}>
                      Happy Customers
                    </p>
                  </div>
                  <Star
                    style={{
                      width: "14px",
                      height: "14px",
                      fill: "#fbbf24",
                      color: "#fbbf24",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 1.5rem 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
          }}
        >
          <div>
            <p
              style={{
                color: "#4f7d52",
                fontSize: "0.78rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "6px",
              }}
            >
              Browse
            </p>
            <h2 className="section-title">Popular Categories</h2>
          </div>
          <Link
            to="/category/smartphones"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.85rem",
              color: "#4f7d52",
              fontWeight: "500",
              textDecoration: "none",
              transition: "gap 0.2s",
            }}
          >
            View All Categories{" "}
            <ChevronRight style={{ width: "16px", height: "16px" }} />
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "16px",
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                padding: "20px 12px",
                backgroundColor: "#ffffff",
                border: "1px solid #ebebeb",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "all 0.2s",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a3c4a5";
                e.currentTarget.style.backgroundColor = "#f4f7f4";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgb(0 0 0 / 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ebebeb";
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "2rem" }}>{cat.icon}</span>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "#3a3a3a",
                  fontWeight: "500",
                  lineHeight: "1.2",
                }}
              >
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 1.5rem 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
          }}
        >
          <div>
            <p
              style={{
                color: "#4f7d52",
                fontSize: "0.78rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "6px",
              }}
            >
              Handpicked
            </p>
            <h2 className="section-title">Best Selling Products</h2>
          </div>
          <Link
            to="/category/smartphones"
            className="btn-outline"
            style={{ fontSize: "0.75rem", padding: "8px 18px" }}
          >
            View All Products{" "}
            <ArrowRight style={{ width: "14px", height: "14px" }} />
          </Link>
        </div>
        {fl ? (
          <ProductSkeleton count={8} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {featured?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Promo Banner ── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "64px auto 0",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#f4f7f4",
            border: "1px solid #a3c4a5",
            borderRadius: "20px",
            padding: "60px 64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-40px",
              top: "-40px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              backgroundColor: "rgb(79 125 82 / 0.08)",
              pointerEvents: "none",
            }}
          />
          <div>
            <p
              style={{
                color: "#4f7d52",
                fontSize: "0.78rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              Limited Time
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: "700",
                color: "#141414",
                marginBottom: "12px",
              }}
            >
              Up to 50% Off
              <br />
              Electronics
            </h2>
            <p
              style={{
                color: "#757575",
                fontSize: "0.95rem",
                maxWidth: "380px",
              }}
            >
              Get the best deals on smartphones, laptops and accessories. Sale
              ends Sunday.
            </p>
          </div>
          <Link
            to="/category/smartphones"
            className="btn-primary"
            style={{
              fontSize: "0.8rem",
              padding: "14px 32px",
              borderRadius: "8px",
              flexShrink: 0,
            }}
          >
            Shop Electronics{" "}
            <ArrowRight style={{ width: "15px", height: "15px" }} />
          </Link>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 1.5rem 0",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              color: "#f59e0b",
              fontSize: "0.78rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
            }}
          >
            Just In
          </p>
          <h2 className="section-title">New Arrivals</h2>
        </div>
        {nl ? (
          <ProductSkeleton count={4} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {newArrivals?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Best Sellers ── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 1.5rem 0",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              color: "#ef4444",
              fontSize: "0.78rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
            }}
          >
            🔥 Trending
          </p>
          <h2 className="section-title">Best Sellers</h2>
        </div>
        {bl ? (
          <ProductSkeleton count={4} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {bestSellers?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Testimonials ── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 1.5rem 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p
            style={{
              color: "#4f7d52",
              fontSize: "0.78rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            Reviews
          </p>
          <h2 className="section-title">What Customers Say</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              name: "Amara O.",
              review:
                "Fastest delivery I ever experienced. My laptop arrived in 2 days!",
              rating: 5,
              initials: "AO",
            },
            {
              name: "Chidi N.",
              review:
                "Great product quality. The skincare items are exactly as described.",
              rating: 5,
              initials: "CN",
            },
            {
              name: "Fatima B.",
              review:
                "Excellent customer service. Returns process was seamless and quick.",
              rating: 4,
              initials: "FB",
            },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #ebebeb",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 2px 8px rgb(0 0 0 / 0.05)",
              }}
            >
              <div
                style={{ display: "flex", gap: "2px", marginBottom: "14px" }}
              >
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    style={{
                      width: "15px",
                      height: "15px",
                      fill: "#fbbf24",
                      color: "#fbbf24",
                    }}
                  />
                ))}
              </div>
              <p
                style={{
                  color: "#555555",
                  fontSize: "0.875rem",
                  lineHeight: "1.7",
                  marginBottom: "16px",
                }}
              >
                "{t.review}"
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor: "#f4f7f4",
                    border: "1px solid #a3c4a5",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f7d52",
                    fontWeight: "700",
                    fontSize: "0.8rem",
                  }}
                >
                  {t.initials}
                </div>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#242424",
                  }}
                >
                  {t.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
