import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ShoppingCart,
  Heart,
  Star,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  useNewArrivals,
  useBestSellers,
  useFeaturedProducts,
} from "../hooks/useProducts.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { formatPrice, discountedPrice, CATEGORIES } from "../api/products.js";
import { truncate } from "../lib/utils.js";
import ProductCard from "../components/product/ProductCard.jsx";
import ProductSkeleton from "../components/product/ProductSkeleton.jsx";

const TABS = [
  { id: "all", label: "All New", icon: "✨" },
  { id: "trending", label: "Trending", icon: "🔥" },
  { id: "picks", label: "Editor Picks", icon: "⭐" },
];

export default function NewArrivalsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: newArrivals = [], isLoading: nl } = useNewArrivals();
  const { data: bestSellers = [], isLoading: bl } = useBestSellers();
  const { data: featured = [], isLoading: fl } = useFeaturedProducts(16);

  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const tabProducts = {
    all: newArrivals,
    trending: bestSellers,
    picks: featured,
  };

  const current = tabProducts[activeTab] || [];
  const isLoading = { all: nl, trending: bl, picks: fl }[activeTab];

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <div
        style={{
          backgroundColor: "#f4f7f4",
          borderBottom: "1px solid #c8ddc8",
          padding: "clamp(36px, 6vw, 64px) 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative rings */}
        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "-80px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            border: "40px solid rgba(79,125,82,0.07)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-60px",
            bottom: "-60px",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            border: "32px solid rgba(79,125,82,0.05)",
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
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "40px",
              alignItems: "center",
            }}
          >
            {/* Text */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  backgroundColor: "#fff",
                  border: "1px solid #a3c4a5",
                  borderRadius: "99px",
                  padding: "5px 14px",
                  marginBottom: "18px",
                }}
              >
                <Sparkles
                  style={{ width: "13px", height: "13px", color: "#4f7d52" }}
                />
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    color: "#4f7d52",
                    letterSpacing: "0.07em",
                  }}
                >
                  JUST ARRIVED
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "clamp(2rem, 5vw, 3.25rem)",
                  fontWeight: "700",
                  color: "#141414",
                  lineHeight: "1.15",
                  marginBottom: "14px",
                }}
              >
                New Arrivals
                <br />
                <span style={{ color: "#4f7d52" }}>Fresh & Trending</span>
              </h1>

              <p
                style={{
                  color: "#757575",
                  fontSize: "0.95rem",
                  lineHeight: "1.75",
                  maxWidth: "400px",
                  marginBottom: "24px",
                }}
              >
                Discover the latest products added to our store. Fresh styles,
                new tech, and must-have items — updated regularly just for you.
              </p>

              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {[
                  {
                    icon: (
                      <TrendingUp
                        style={{
                          width: "16px",
                          height: "16px",
                          color: "#4f7d52",
                        }}
                      />
                    ),
                    text: "Updated weekly",
                  },
                  {
                    icon: (
                      <Star
                        style={{
                          width: "16px",
                          height: "16px",
                          color: "#fbbf24",
                          fill: "#fbbf24",
                        }}
                      />
                    ),
                    text: "Top rated picks",
                  },
                  {
                    icon: (
                      <ShoppingCart
                        style={{
                          width: "16px",
                          height: "16px",
                          color: "#4f7d52",
                        }}
                      />
                    ),
                    text: "Free shipping",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {item.icon}
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "#555555",
                        fontWeight: "500",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category quick links */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
              }}
            >
              {CATEGORIES.slice(0, 4).map((cat) => (
                <Link
                  key={cat.slug}
                  to={"/category/" + cat.slug}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 16px",
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#a3c4a5";
                    e.currentTarget.style.backgroundColor = "#f4f7f4";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
                  <div>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: "600",
                        color: "#242424",
                      }}
                    >
                      {cat.label}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#a0a0a0" }}>
                      New items
                    </p>
                  </div>
                  <ArrowRight
                    style={{
                      width: "14px",
                      height: "14px",
                      color: "#c8c8c8",
                      marginLeft: "auto",
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
          borderBottom: "1px solid #ebebeb",
          backgroundColor: "#fff",
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
            gap: "4px",
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
                padding: "14px 20px",
                fontSize: "0.875rem",
                fontWeight: "600",
                border: "none",
                background: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.2s",
                borderBottom:
                  "2.5px solid " +
                  (activeTab === tab.id ? "#4f7d52" : "transparent"),
                color: activeTab === tab.id ? "#4f7d52" : "#757575",
                marginBottom: "-1px",
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products grid ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "28px 16px 64px",
        }}
      >
        {isLoading ? (
          <ProductSkeleton count={8} />
        ) : current.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 16px" }}>
            <p style={{ fontSize: "2rem", marginBottom: "12px" }}>✨</p>
            <p style={{ color: "#757575" }}>Loading new arrivals...</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
              gap: "16px",
            }}
          >
            {current.map((product, index) => {
              const finalPrice = discountedPrice(
                product.price,
                product.discountPercentage,
              );
              const wishlisted = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ebebeb",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "all 0.25s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    position: "relative",
                    animationDelay: index * 0.04 + "s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 28px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#a3c4a5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 1px 4px rgba(0,0,0,0.05)";
                    e.currentTarget.style.borderColor = "#ebebeb";
                  }}
                >
                  {/* NEW badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "0",
                      zIndex: 2,
                      backgroundColor: "#4f7d52",
                      color: "#fff",
                      fontSize: "0.62rem",
                      fontWeight: "700",
                      padding: "3px 10px 3px 8px",
                      borderRadius: "0 99px 99px 0",
                      letterSpacing: "0.05em",
                    }}
                  >
                    ✨ NEW
                  </div>

                  {/* Image */}
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      overflow: "hidden",
                      backgroundColor: "#f7f7f7",
                    }}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.06)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    {/* Wishlist */}
                    <button
                      onClick={() => toggle(product)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border:
                          "1.5px solid " + (wishlisted ? "#f43f5e" : "#e0e0e0"),
                        backgroundColor: wishlisted ? "#fff1f2" : "#fff",
                        color: wishlisted ? "#f43f5e" : "#a0a0a0",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <Heart
                        style={{
                          width: "13px",
                          height: "13px",
                          fill: wishlisted ? "#f43f5e" : "none",
                        }}
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "12px 14px 14px" }}>
                    <p
                      style={{
                        fontSize: "0.68rem",
                        color: "#a0a0a0",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "3px",
                        fontWeight: "500",
                      }}
                    >
                      {product.brand || product.category}
                    </p>
                    <Link
                      to={"/product/" + product.id}
                      style={{ textDecoration: "none" }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          color: "#242424",
                          lineHeight: "1.35",
                          marginBottom: "6px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#4f7d52")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#242424")
                        }
                      >
                        {truncate(product.title, 40)}
                      </p>
                    </Link>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        marginBottom: "9px",
                      }}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          style={{
                            width: "11px",
                            height: "11px",
                            fill:
                              i < Math.floor(product.rating)
                                ? "#fbbf24"
                                : "none",
                            color:
                              i < Math.floor(product.rating)
                                ? "#fbbf24"
                                : "#d4d4d4",
                          }}
                        />
                      ))}
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#a0a0a0",
                          marginLeft: "2px",
                        }}
                      >
                        ({product.reviews?.length || 0})
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "6px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: "700",
                            color: "#141414",
                            fontSize: "0.95rem",
                          }}
                        >
                          {formatPrice(finalPrice)}
                        </span>
                        {product.discountPercentage > 0.5 && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "#a0a0a0",
                              textDecoration: "line-through",
                              marginLeft: "5px",
                            }}
                          >
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addItem(product)}
                        style={{
                          width: "32px",
                          height: "32px",
                          flexShrink: 0,
                          backgroundColor: "#f4f7f4",
                          border: "1.5px solid #a3c4a5",
                          borderRadius: "7px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#4f7d52",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#4f7d52";
                          e.currentTarget.style.color = "#fff";
                          e.currentTarget.style.borderColor = "#4f7d52";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#f4f7f4";
                          e.currentTarget.style.color = "#4f7d52";
                          e.currentTarget.style.borderColor = "#a3c4a5";
                        }}
                      >
                        <ShoppingCart
                          style={{ width: "13px", height: "13px" }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Newsletter CTA ── */}
      <div
        style={{
          backgroundColor: "#f4f7f4",
          borderTop: "1px solid #c8ddc8",
          padding: "clamp(36px, 5vw, 56px) 16px",
        }}
      >
        <div
          style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}
        >
          <Sparkles
            style={{
              width: "28px",
              height: "28px",
              color: "#4f7d52",
              margin: "0 auto 12px",
            }}
          />
          <h2
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(1.4rem, 3vw, 1.875rem)",
              fontWeight: "700",
              color: "#141414",
              marginBottom: "10px",
            }}
          >
            Be the First to Know
          </h2>
          <p
            style={{
              color: "#757575",
              fontSize: "0.9rem",
              marginBottom: "20px",
              lineHeight: "1.6",
            }}
          >
            Subscribe and get new arrivals straight to your inbox — before
            anyone else!
          </p>
          <div
            style={{
              display: "flex",
              gap: "0",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              style={{
                flex: 1,
                minWidth: 0,
                padding: "11px 14px",
                border: "1.5px solid #a3c4a5",
                borderRight: "none",
                borderRadius: "8px 0 0 8px",
                fontSize: "0.875rem",
                outline: "none",
                backgroundColor: "#fff",
                color: "#242424",
              }}
            />
            <button
              className="btn-primary"
              style={{
                borderRadius: "0 8px 8px 0",
                padding: "11px 20px",
                whiteSpace: "nowrap",
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
