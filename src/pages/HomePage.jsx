import { Link } from "react-router-dom";
import {
  ArrowRight,
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

export default function HomePage() {
  const { data: featured, isLoading: fl } = useFeaturedProducts(8);
  const { data: newArrivals, isLoading: nl } = useNewArrivals();
  const { data: bestSellers, isLoading: bl } = useBestSellers();

  const S = {
    container: { maxWidth: "1280px", margin: "0 auto", padding: "0 16px" },
    section: { padding: "56px 0 0" },
    sectionHead: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: "24px",
      gap: "12px",
      flexWrap: "wrap",
    },
    label: {
      fontSize: "0.72rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      marginBottom: "5px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
      gap: "16px",
    },
  };

  return (
    <div style={{ backgroundColor: "#ffffff", overflowX: "hidden" }}>
      {/* ── Hero ── */}
      <section
        style={{
          backgroundColor: "#f9f9f9",
          borderBottom: "1px solid #ebebeb",
          padding: "48px 0",
        }}
      >
        <div style={S.container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "40px",
              alignItems: "center",
            }}
          >
            {/* Text side */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  backgroundColor: "#f4f7f4",
                  border: "1px solid #a3c4a5",
                  borderRadius: "99px",
                  padding: "5px 13px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    backgroundColor: "#4f7d52",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    color: "#4f7d52",
                    fontSize: "0.72rem",
                    fontWeight: "600",
                    letterSpacing: "0.06em",
                  }}
                >
                  NEW COLLECTION 2025
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "clamp(2.2rem, 6vw, 3.75rem)",
                  fontWeight: "700",
                  color: "#141414",
                  lineHeight: "1.1",
                  marginBottom: "16px",
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
                  fontSize: "0.95rem",
                  lineHeight: "1.75",
                  maxWidth: "400px",
                  marginBottom: "28px",
                }}
              >
                Find top quality products at the best prices. Shop the latest
                collection and enjoy exclusive deals.
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link
                  to="/category/smartphones"
                  className="btn-primary"
                  style={{ borderRadius: "6px" }}
                >
                  Shop Now{" "}
                  <ArrowRight style={{ width: "15px", height: "15px" }} />
                </Link>
                <Link
                  to="/category/tops"
                  className="btn-secondary"
                  style={{ borderRadius: "6px" }}
                >
                  Explore{" "}
                  <ArrowRight style={{ width: "15px", height: "15px" }} />
                </Link>
              </div>

              {/* Perks */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "36px",
                  paddingTop: "28px",
                  borderTop: "1px solid #ebebeb",
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    Icon: Truck,
                    title: "Free Shipping",
                    desc: "On orders over ₦50k",
                  },
                  {
                    Icon: RotateCcw,
                    title: "Easy Returns",
                    desc: "30-day policy",
                  },
                  {
                    Icon: Shield,
                    title: "Secure Payment",
                    desc: "100% secure checkout",
                  },
                ].map(({ Icon, title, desc }, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#f4f7f4",
                        border: "1px solid #a3c4a5",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4f7d52",
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: "17px", height: "17px" }} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          color: "#242424",
                        }}
                      >
                        {title}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#a0a0a0" }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  border: "1px solid #ebebeb",
                  boxShadow: "0 16px 48px rgb(0 0 0 / 0.08)",
                  overflow: "hidden",
                  width: "100%",
                  maxWidth: "420px",
                  aspectRatio: "4/5",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
                  alt="Featured"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Floating badge */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "0",
                  backgroundColor: "#4f7d52",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  boxShadow: "0 4px 12px rgb(79 125 82 / 0.3)",
                }}
              >
                <p
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "0.82rem",
                  }}
                >
                  🔥 Hot Deal
                </p>
              </div>

              {/* Social proof */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "0",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #ebebeb",
                  padding: "10px 14px",
                  boxShadow: "0 6px 20px rgb(0 0 0 / 0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex" }}>
                  {["🧑", "👩", "👨"].map((e, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "1.1rem",
                        marginLeft: i > 0 ? "-5px" : 0,
                      }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: "700",
                      color: "#242424",
                    }}
                  >
                    2K+ Happy Customers
                  </p>
                  <div
                    style={{ display: "flex", gap: "1px", marginTop: "1px" }}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: "10px",
                          height: "10px",
                          fill: "#fbbf24",
                          color: "#fbbf24",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ ...S.section }}>
        <div style={S.container}>
          <div style={S.sectionHead}>
            <div>
              <p style={{ ...S.label, color: "#4f7d52" }}>Browse</p>
              <h2 className="section-title">Popular Categories</h2>
            </div>
            <Link
              to="/category/smartphones"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.82rem",
                color: "#4f7d52",
                fontWeight: "500",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              View All{" "}
              <ChevronRight style={{ width: "15px", height: "15px" }} />
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "12px",
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
                  gap: "8px",
                  padding: "16px 10px",
                  backgroundColor: "#fff",
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
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ebebeb";
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <span style={{ fontSize: "1.75rem" }}>{cat.icon}</span>
                <span
                  style={{
                    fontSize: "0.72rem",
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
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={S.sectionHead}>
            <div>
              <p style={{ ...S.label, color: "#4f7d52" }}>Handpicked</p>
              <h2 className="section-title">Best Selling Products</h2>
            </div>
            <Link
              to="/category/smartphones"
              className="btn-outline"
              style={{
                fontSize: "0.75rem",
                padding: "7px 16px",
                whiteSpace: "nowrap",
              }}
            >
              View All <ArrowRight style={{ width: "13px", height: "13px" }} />
            </Link>
          </div>
          {fl ? (
            <ProductSkeleton count={8} />
          ) : (
            <div style={S.grid}>
              {featured?.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section style={S.section}>
        <div style={S.container}>
          <div
            style={{
              backgroundColor: "#f4f7f4",
              border: "1px solid #a3c4a5",
              borderRadius: "16px",
              padding: "clamp(28px, 5vw, 56px) clamp(20px, 5vw, 56px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div>
              <p style={{ ...S.label, color: "#4f7d52", marginBottom: "8px" }}>
                Limited Time
              </p>
              <h2
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  fontWeight: "700",
                  color: "#141414",
                  marginBottom: "10px",
                }}
              >
                Up to 50% Off
                <br />
                Electronics
              </h2>
              <p
                style={{
                  color: "#757575",
                  fontSize: "0.9rem",
                  maxWidth: "360px",
                }}
              >
                Best deals on smartphones, laptops and accessories. Sale ends
                Sunday.
              </p>
            </div>
            <Link
              to="/category/smartphones"
              className="btn-primary"
              style={{ borderRadius: "8px", flexShrink: 0 }}
            >
              Shop Electronics{" "}
              <ArrowRight style={{ width: "15px", height: "15px" }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={{ marginBottom: "24px" }}>
            <p style={{ ...S.label, color: "#f59e0b" }}>Just In</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          {nl ? (
            <ProductSkeleton count={4} />
          ) : (
            <div style={S.grid}>
              {newArrivals?.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={{ marginBottom: "24px" }}>
            <p style={{ ...S.label, color: "#ef4444" }}>🔥 Trending</p>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          {bl ? (
            <ProductSkeleton count={4} />
          ) : (
            <div style={S.grid}>
              {bestSellers?.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ ...S.section, paddingBottom: "72px" }}>
        <div style={S.container}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p style={{ ...S.label, color: "#4f7d52" }}>Reviews</p>
            <h2 className="section-title">What Customers Say</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "16px",
            }}
          >
            {[
              {
                name: "Amara O.",
                review:
                  "Fastest delivery I experienced. My laptop arrived in 2 days!",
                rating: 5,
                initials: "AO",
              },
              {
                name: "Chidi N.",
                review:
                  "Great quality. The skincare items are exactly as described.",
                rating: 5,
                initials: "CN",
              },
              {
                name: "Fatima B.",
                review:
                  "Excellent service. Returns process was seamless and quick.",
                rating: 4,
                initials: "FB",
              },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ebebeb",
                  borderRadius: "14px",
                  padding: "22px",
                  boxShadow: "0 2px 8px rgb(0 0 0 / 0.05)",
                }}
              >
                <div
                  style={{ display: "flex", gap: "2px", marginBottom: "12px" }}
                >
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      style={{
                        width: "14px",
                        height: "14px",
                        fill: "#fbbf24",
                        color: "#fbbf24",
                      }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    color: "#555",
                    fontSize: "0.85rem",
                    lineHeight: "1.7",
                    marginBottom: "14px",
                  }}
                >
                  "{t.review}"
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "9px" }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#f4f7f4",
                      border: "1px solid #a3c4a5",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4f7d52",
                      fontWeight: "700",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t.initials}
                  </div>
                  <span
                    style={{
                      fontSize: "0.85rem",
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
        </div>
      </section>
    </div>
  );
}
