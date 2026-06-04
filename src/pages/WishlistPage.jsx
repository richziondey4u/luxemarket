import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, discountedPrice } from "../api/products.js";
import { truncate } from "../lib/utils.js";

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();

  const T = {
    page: { backgroundColor: "var(--bg-page)", minHeight: "100vh" },
    head: {
      borderBottom: "1px solid var(--border-light)",
      backgroundColor: "var(--bg-section)",
      padding: "14px 16px",
    },
    wrap: { maxWidth: "1280px", margin: "0 auto" },
    h1: {
      fontFamily: "Georgia, serif",
      fontSize: "clamp(1.5rem, 4vw, 2rem)",
      fontWeight: "700",
      color: "var(--text-primary)",
      marginBottom: "28px",
    },
  };

  return (
    <div style={T.page}>
      <div style={T.head}>
        <div style={T.wrap}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            <Link
              to="/"
              style={{ color: "var(--text-muted)", textDecoration: "none" }}
            >
              Home
            </Link>
            {" / "}
            <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>
              Wishlist
            </span>
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "28px 16px 64px",
        }}
      >
        <h1 style={T.h1}>
          My Wishlist{" "}
          <span
            style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: "400",
            }}
          >
            ({items.length} items)
          </span>
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 16px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "var(--bg-muted)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                border: "1px solid var(--border-light)",
              }}
            >
              <Heart
                style={{
                  width: "36px",
                  height: "36px",
                  color: "var(--text-subtle)",
                }}
              />
            </div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.5rem",
                color: "var(--text-primary)",
                marginBottom: "10px",
              }}
            >
              Your wishlist is empty
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "24px",
                fontSize: "0.9rem",
              }}
            >
              Save items you love and come back to them anytime.
            </p>
            <Link
              to="/"
              className="btn-primary"
              style={{ borderRadius: "8px" }}
            >
              Discover Products{" "}
              <ArrowRight style={{ width: "16px", height: "16px" }} />
            </Link>
          </div>
        ) : (
          <>
            {/* Action bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                {items.length} saved item{items.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => items.forEach((p) => addItem(p))}
                className="btn-primary"
                style={{
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  padding: "8px 18px",
                }}
              >
                <ShoppingCart style={{ width: "14px", height: "14px" }} />
                Add All to Cart
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
                gap: "16px",
              }}
            >
              {items.map((product) => {
                const finalPrice = discountedPrice(
                  product.price,
                  product.discountPercentage,
                );
                return (
                  <div
                    key={product.id}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "var(--shadow-card)",
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "var(--shadow-card-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "var(--shadow-card)";
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        backgroundColor: "var(--bg-muted)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {product.discountPercentage > 0.5 && (
                        <span
                          className="badge-sale"
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                          }}
                        >
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      )}
                      {/* Remove */}
                      <button
                        onClick={() => toggle(product)}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          backgroundColor: "var(--bg-card)",
                          border: "1px solid var(--border-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 style={{ width: "13px", height: "13px" }} />
                      </button>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "14px" }}>
                      <Link
                        to={"/product/" + product.id}
                        style={{ textDecoration: "none" }}
                      >
                        <p
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            marginBottom: "4px",
                            lineHeight: "1.35",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "var(--brand)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              "var(--text-primary)")
                          }
                        >
                          {truncate(product.title, 40)}
                        </p>
                      </Link>
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-subtle)",
                          marginBottom: "10px",
                        }}
                      >
                        {product.brand || product.category}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontWeight: "700",
                              color: "var(--text-primary)",
                              fontSize: "1rem",
                            }}
                          >
                            {formatPrice(finalPrice)}
                          </span>
                          {product.discountPercentage > 0.5 && (
                            <span
                              style={{
                                fontSize: "0.72rem",
                                color: "var(--text-subtle)",
                                textDecoration: "line-through",
                                marginLeft: "6px",
                              }}
                            >
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => addItem(product)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "6px 12px",
                            borderRadius: "7px",
                            backgroundColor: "var(--brand)",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.72rem",
                            fontWeight: "600",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--brand-dark)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--brand)")
                          }
                        >
                          <ShoppingCart
                            style={{ width: "12px", height: "12px" }}
                          />{" "}
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
