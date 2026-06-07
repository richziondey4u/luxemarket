import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { formatPrice, discountedPrice } from "../../api/products.js";
import { truncate } from "../../lib/utils.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const final = discountedPrice(product.price, product.discountPercentage);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "var(--brand-mid)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "var(--border-light)";
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1",
          overflow: "hidden",
          backgroundColor: "var(--bg-muted)",
          flexShrink: 0,
        }}
      >
        <Link to={`/product/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s",
              display: "block",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.06)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>

        {/* Discount badge */}
        {product.discountPercentage > 0.5 && (
          <span
            style={{
              position: "absolute",
              top: "6px",
              left: "6px",
              backgroundColor: "#f97316",
              color: "#fff",
              fontSize: "0.62rem",
              fontWeight: "800",
              padding: "2px 6px",
              borderRadius: "3px",
              letterSpacing: "0.02em",
            }}
          >
            -{Math.round(product.discountPercentage)}%
          </span>
        )}

        {/* Low stock */}
        {product.stock > 0 && product.stock < 10 && (
          <span
            style={{
              position: "absolute",
              bottom: "6px",
              left: "6px",
              backgroundColor: "#ef4444",
              color: "#fff",
              fontSize: "0.58rem",
              fontWeight: "700",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            Only {product.stock} left!
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product);
          }}
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            color: wishlisted ? "#ef4444" : "var(--text-subtle)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#ef4444";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-light)";
            e.currentTarget.style.color = wishlisted
              ? "#ef4444"
              : "var(--text-subtle)";
          }}
        >
          <Heart
            style={{
              width: "12px",
              height: "12px",
              fill: wishlisted ? "#ef4444" : "none",
            }}
          />
        </button>
      </div>

      {/* Info */}
      <div
        style={{
          padding: "8px 10px 10px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {/* Brand */}
        <p
          style={{
            fontSize: "0.62rem",
            color: "var(--text-subtle)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: 0,
            fontWeight: "600",
          }}
        >
          {product.brand || product.category}
        </p>

        {/* Title */}
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-primary)",
              lineHeight: "1.35",
              fontWeight: "400",
              margin: 0,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
          >
            {truncate(product.title, 40)}
          </p>
        </Link>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              style={{
                width: "10px",
                height: "10px",
                fill: i < Math.floor(product.rating) ? "#f97316" : "none",
                color:
                  i < Math.floor(product.rating)
                    ? "#f97316"
                    : "var(--border-medium)",
              }}
            />
          ))}
          <span
            style={{
              fontSize: "0.65rem",
              color: "var(--text-subtle)",
              marginLeft: "2px",
            }}
          >
            ({product.reviews?.length || 0})
          </span>
        </div>

        {/* Price + add to cart */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "4px",
            marginTop: "auto",
            paddingTop: "4px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: "800",
                color: "var(--brand)",
                margin: 0,
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {formatPrice(final)}
            </p>
            {product.discountPercentage > 0.5 && (
              <p
                style={{
                  fontSize: "0.68rem",
                  color: "var(--text-subtle)",
                  textDecoration: "line-through",
                  margin: 0,
                }}
              >
                {formatPrice(product.price)}
              </p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            disabled={product.stock === 0}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor:
                product.stock === 0 ? "var(--bg-muted)" : "var(--brand)",
              border: "none",
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (product.stock > 0)
                e.currentTarget.style.backgroundColor = "var(--brand-dark)";
            }}
            onMouseLeave={(e) => {
              if (product.stock > 0)
                e.currentTarget.style.backgroundColor = "var(--brand)";
            }}
          >
            <ShoppingCart
              style={{
                width: "13px",
                height: "13px",
                color: product.stock === 0 ? "var(--text-subtle)" : "#fff",
              }}
            />
          </button>
        </div>

        {/* Out of stock label */}
        {product.stock === 0 && (
          <p
            style={{
              fontSize: "0.65rem",
              color: "#ef4444",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Out of Stock
          </p>
        )}
      </div>
    </div>
  );
}
