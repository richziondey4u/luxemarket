import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { formatPrice, discountedPrice } from "../../api/products.js";
import { truncate } from "../../lib/utils.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const finalPrice = discountedPrice(product.price, product.discountPercentage);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #ebebeb",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.25s",
        boxShadow: "0 1px 4px rgb(0 0 0 / 0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgb(0 0 0 / 0.1)";
        e.currentTarget.style.borderColor = "#a3c4a5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 4px rgb(0 0 0 / 0.05)";
        e.currentTarget.style.borderColor = "#ebebeb";
      }}
    >
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
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          {product.discountPercentage > 0.5 && (
            <span className="badge-sale">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="badge-hot">Low Stock</span>
          )}
          {product.rating >= 4.8 && (
            <span className="badge-new">Top Rated</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product);
          }}
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
            border: `1.5px solid ${wishlisted ? "#f43f5e" : "#e0e0e0"}`,
            backgroundColor: wishlisted ? "#fff1f2" : "#ffffff",
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

        {/* Quick add overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgb(255 255 255 / 0.95)",
            padding: "10px",
            display: "flex",
            gap: "6px",
            transform: "translateY(100%)",
            transition: "transform 0.25s",
          }}
          className="card-overlay"
        >
          <Link
            to={`/product/${product.id}`}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "7px",
              backgroundColor: "#fff",
              border: "1.5px solid #e0e0e0",
              borderRadius: "7px",
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#3a3a3a",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#4f7d52";
              e.currentTarget.style.color = "#4f7d52";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e0e0e0";
              e.currentTarget.style.color = "#3a3a3a";
            }}
          >
            <Eye style={{ width: "13px", height: "13px" }} /> View
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "7px",
              backgroundColor: "#4f7d52",
              border: "1.5px solid #4f7d52",
              borderRadius: "7px",
              fontSize: "0.75rem",
              fontWeight: "600",
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
            <ShoppingCart style={{ width: "13px", height: "13px" }} /> Add
          </button>
        </div>
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
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontSize: "0.85rem",
              fontWeight: "500",
              color: "#242424",
              lineHeight: "1.4",
              marginBottom: "7px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#4f7d52")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#242424")}
          >
            {truncate(product.title, 42)}
          </h3>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "9px",
          }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              style={{
                width: "11px",
                height: "11px",
                fill: i < Math.floor(product.rating) ? "#fbbf24" : "none",
                color: i < Math.floor(product.rating) ? "#fbbf24" : "#d4d4d4",
              }}
            />
          ))}
          <span style={{ fontSize: "0.7rem", color: "#a0a0a0" }}>
            ({product.reviews?.length || 0})
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: "700",
                color: "#141414",
                fontSize: "0.95rem",
                whiteSpace: "nowrap",
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
                  whiteSpace: "nowrap",
                }}
              >
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            style={{
              width: "30px",
              height: "30px",
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
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f4f7f4";
              e.currentTarget.style.color = "#4f7d52";
            }}
          >
            <ShoppingCart style={{ width: "13px", height: "13px" }} />
          </button>
        </div>
      </div>

      <style>{`
        div:hover > div > .card-overlay { transform: translateY(0) !important; }
      `}</style>
    </div>
  );
}
