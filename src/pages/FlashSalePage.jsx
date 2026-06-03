import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  ShoppingCart,
  Heart,
  Star,
  ArrowRight,
  Clock,
  Filter,
  X,
} from "lucide-react";
import { useFeaturedProducts } from "../hooks/useProducts.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { formatPrice, discountedPrice } from "../api/products.js";
import { truncate } from "../lib/utils.js";

/* ── Countdown hook ── */
function useCountdown(targetHours = 8) {
  const getInitial = useCallback(() => {
    const saved = sessionStorage.getItem("flash_sale_end");
    if (saved) {
      const diff = parseInt(saved) - Date.now();
      if (diff > 0) return diff;
    }
    const end = Date.now() + targetHours * 60 * 60 * 1000;
    sessionStorage.setItem("flash_sale_end", end.toString());
    return targetHours * 60 * 60 * 1000;
  }, [targetHours]);

  const [ms, setMs] = useState(getInitial);

  useEffect(() => {
    const t = setInterval(() => {
      setMs((prev) => {
        if (prev <= 1000) {
          sessionStorage.removeItem("flash_sale_end");
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { h, m, s, expired: ms === 0 };
}

function TimeBox({ value, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "64px",
          height: "64px",
          backgroundColor: "#4f7d52",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          fontWeight: "700",
          color: "#fff",
          fontFamily: "DM Sans, sans-serif",
          boxShadow: "0 4px 12px rgba(79,125,82,0.25)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <p
        style={{
          fontSize: "0.65rem",
          color: "#757575",
          marginTop: "5px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: "600",
        }}
      >
        {label}
      </p>
    </div>
  );
}

const DISCOUNT_FILTERS = [
  { label: "All Deals", min: 0 },
  { label: "10%+ Off", min: 10 },
  { label: "20%+ Off", min: 20 },
  { label: "30%+ Off", min: 30 },
];

export default function FlashSalePage() {
  const { h, m, s, expired } = useCountdown(8);
  const { data: products = [], isLoading } = useFeaturedProducts(30);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

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
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* ── Hero banner ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1a3a1c 0%, #2d5a30 50%, #1a3a1c 100%)",
          padding: "clamp(36px, 6vw, 64px) 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "-60px",
            width: "200px",
            height: "200px",
            backgroundColor: "rgba(114,164,116,0.15)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-60px",
            width: "200px",
            height: "200px",
            backgroundColor: "rgba(251,191,36,0.1)",
            borderRadius: "50%",
            filter: "blur(40px)",
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                backgroundColor: "rgba(251,191,36,0.2)",
                border: "1px solid rgba(251,191,36,0.4)",
                borderRadius: "99px",
                padding: "5px 14px",
              }}
            >
              <Zap
                style={{
                  width: "13px",
                  height: "13px",
                  color: "#fbbf24",
                  fill: "#fbbf24",
                }}
              />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: "#fbbf24",
                  letterSpacing: "0.08em",
                }}
              >
                LIMITED TIME OFFER
              </span>
            </div>
          </div>

          <h1
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              fontWeight: "700",
              color: "#ffffff",
              lineHeight: "1.15",
              marginBottom: "12px",
            }}
          >
            ⚡ Flash Sale
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "1rem",
              marginBottom: "32px",
            }}
          >
            Massive discounts on top products — grab them before time runs out!
          </p>

          {/* Countdown */}
          {expired ? (
            <div
              style={{
                display: "inline-block",
                backgroundColor: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: "12px",
                padding: "12px 24px",
                color: "#fca5a5",
                fontWeight: "600",
                fontSize: "0.95rem",
              }}
            >
              ⏰ Sale has ended — check back soon!
            </div>
          ) : (
            <div>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.78rem",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Sale ends in
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <TimeBox value={h} label="Hours" />
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#ffffff",
                    marginTop: "12px",
                  }}
                >
                  :
                </div>
                <TimeBox value={m} label="Minutes" />
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#ffffff",
                    marginTop: "12px",
                  }}
                >
                  :
                </div>
                <TimeBox value={s} label="Seconds" />
              </div>
            </div>
          )}

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              marginTop: "36px",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: saleProducts.length + "+", label: "Products on Sale" },
              { value: "Up to 70%", label: "Discount" },
              { value: "Free", label: "Delivery over ₦50k" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.75rem",
                    marginTop: "2px",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters bar ── */}
      <div
        style={{
          borderBottom: "1px solid #ebebeb",
          backgroundColor: "#f9f9f9",
          padding: "14px 16px",
          position: "sticky",
          top: "60px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Discount filters */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {DISCOUNT_FILTERS.map((f) => (
              <button
                key={f.min}
                onClick={() => setMinDiscount(f.min)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "99px",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  border: "1.5px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: minDiscount === f.min ? "#4f7d52" : "#fff",
                  borderColor: minDiscount === f.min ? "#4f7d52" : "#e0e0e0",
                  color: minDiscount === f.min ? "#fff" : "#555555",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.78rem",
                color: "#757575",
                whiteSpace: "nowrap",
              }}
            >
              Sort by:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                border: "1.5px solid #e0e0e0",
                borderRadius: "7px",
                fontSize: "0.78rem",
                padding: "6px 10px",
                backgroundColor: "#fff",
                color: "#3a3a3a",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="discount">Biggest Discount</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <span
              style={{
                fontSize: "0.78rem",
                color: "#a0a0a0",
                whiteSpace: "nowrap",
              }}
            >
              {saleProducts.length} items
            </span>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "28px 16px 72px",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
              gap: "16px",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ebebeb",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div style={{ aspectRatio: "1" }} className="shimmer-bg" />
                <div
                  style={{
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{ height: "10px", width: "40%" }}
                    className="shimmer-bg"
                  />
                  <div
                    style={{ height: "14px", width: "90%" }}
                    className="shimmer-bg"
                  />
                  <div
                    style={{ height: "18px", width: "50%" }}
                    className="shimmer-bg"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : saleProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 16px" }}>
            <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>😔</p>
            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.25rem",
                color: "#141414",
                marginBottom: "8px",
              }}
            >
              No deals at this discount level
            </h3>
            <button
              onClick={() => setMinDiscount(0)}
              className="btn-outline"
              style={{ marginTop: "12px", borderRadius: "8px" }}
            >
              Show All Deals
            </button>
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
            {saleProducts.map((product) => {
              const finalPrice = discountedPrice(
                product.price,
                product.discountPercentage,
              );
              const savings = product.price - finalPrice;
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
                  {/* Discount ribbon */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "0",
                      zIndex: 2,
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      fontSize: "0.68rem",
                      fontWeight: "700",
                      padding: "3px 10px 3px 8px",
                      borderRadius: "0 99px 99px 0",
                      boxShadow: "2px 2px 6px rgba(239,68,68,0.3)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    ⚡ -{Math.round(product.discountPercentage)}%
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
                          transition: "color 0.2s",
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

                    {/* Stars */}
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

                    {/* Price */}
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
                            display: "block",
                          }}
                        >
                          {formatPrice(finalPrice)}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "#a0a0a0",
                              textDecoration: "line-through",
                            }}
                          >
                            {formatPrice(product.price)}
                          </span>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              color: "#ef4444",
                              fontWeight: "600",
                            }}
                          >
                            Save {formatPrice(savings)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => addItem(product)}
                        style={{
                          width: "34px",
                          height: "34px",
                          flexShrink: 0,
                          backgroundColor: "#4f7d52",
                          border: "none",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#3d6440")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#4f7d52")
                        }
                      >
                        <ShoppingCart
                          style={{ width: "15px", height: "15px" }}
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
    </div>
  );
}
