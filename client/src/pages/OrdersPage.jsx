import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPrice } from "../api/products.js";
import { apiClient } from "../lib/api.js";

/* ── Status config ── */
const STATUS = {
  PENDING: { label: "Pending", color: "#d97706", bg: "#fef3c7", icon: Clock },
  PAID: { label: "Paid", color: "#059669", bg: "#d1fae5", icon: CheckCircle },
  PROCESSING: {
    label: "Processing",
    color: "#2563eb",
    bg: "#dbeafe",
    icon: Package,
  },
  SHIPPED: { label: "Shipped", color: "#7c3aed", bg: "#ede9fe", icon: Truck },
  DELIVERED: {
    label: "Delivered",
    color: "#059669",
    bg: "#d1fae5",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#dc2626",
    bg: "#fee2e2",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Refunded",
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: RotateCcw,
  },
};

/* ── Timeline steps ── */
const STEPS = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS.PENDING;
  const Icon = cfg.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        borderRadius: "99px",
        backgroundColor: cfg.bg,
        color: cfg.color,
        fontSize: "0.72rem",
        fontWeight: "700",
      }}
    >
      <Icon style={{ width: "12px", height: "12px" }} />
      {cfg.label}
    </span>
  );
}

function Timeline({ status }) {
  if (status === "CANCELLED" || status === "REFUNDED") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 0",
        }}
      >
        <XCircle style={{ width: "20px", height: "20px", color: "#dc2626" }} />
        <span
          style={{ fontSize: "0.85rem", color: "#dc2626", fontWeight: "600" }}
        >
          {status === "CANCELLED" ? "Order Cancelled" : "Order Refunded"}
        </span>
      </div>
    );
  }

  const currentStep = STEPS.indexOf(status);

  return (
    <div style={{ padding: "16px 0" }}>
      <div
        style={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        {/* Background line */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            right: "16px",
            height: "2px",
            backgroundColor: "var(--border-light)",
            zIndex: 0,
          }}
        />
        {/* Progress line */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            height: "2px",
            backgroundColor: "var(--brand)",
            zIndex: 1,
            width:
              currentStep <= 0
                ? "0%"
                : `${(currentStep / (STEPS.length - 1)) * 100}%`,
            transition: "width 0.5s ease",
            maxWidth: "calc(100% - 32px)",
          }}
        />

        {/* Steps */}
        {STEPS.map((step, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;
          const cfg = STATUS[step] || STATUS.PENDING;
          const Icon = cfg.icon;

          return (
            <div
              key={step}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                zIndex: 2,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: done ? "var(--brand)" : "var(--bg-card)",
                  border: `2px solid ${done ? "var(--brand)" : "var(--border-medium)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s",
                  boxShadow: active ? "0 0 0 4px rgba(79,125,82,0.15)" : "none",
                }}
              >
                <Icon
                  style={{
                    width: "14px",
                    height: "14px",
                    color: done ? "#fff" : "var(--text-subtle)",
                  }}
                />
              </div>
              {/* Label */}
              <p
                style={{
                  fontSize: "0.62rem",
                  fontWeight: active ? "700" : "500",
                  color: active
                    ? "var(--brand)"
                    : done
                      ? "var(--text-secondary)"
                      : "var(--text-subtle)",
                  textAlign: "center",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {cfg.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Single order card ── */
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(order.createdAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const time = new Date(order.createdAt).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)")
      }
    >
      {/* Order header */}
      <div
        style={{ padding: "16px 18px", cursor: "pointer", userSelect: "none" }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded((exp) => !exp);
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Left: order info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: 0,
            }}
          >
            {/* First product image */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-muted)",
                overflow: "hidden",
                border: "1px solid var(--border-light)",
                flexShrink: 0,
              }}
            >
              {order.items[0].product?.thumbnail || order.items[0].thumbnail ? (
                <img
                  src={
                    order.items[0]?.product?.thumbnail ||
                    order.items[0]?.thumbnail
                  }
                  alt={order.items[0].title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Package
                    style={{
                      width: "22px",
                      height: "22px",
                      color: "var(--text-subtle)",
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  margin: "0 0 2px",
                  fontFamily: "monospace",
                  fontWeight: "600",
                }}
              >
                #{order.orderNumber}
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  margin: "0 0 4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {order.items?.length === 1
                  ? order.items[0].title
                  : `${order.items?.[0]?.title} + ${(order.items?.length || 1) - 1} more`}
              </p>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                {date} · {time} · {order.items?.length} item
                {order.items?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Right: status + total + arrow */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            <StatusBadge status={order.status} />
            <p
              style={{
                fontSize: "0.95rem",
                fontWeight: "800",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {formatPrice(order.total)}
            </p>
            <div style={{ color: "var(--text-muted)" }}>
              {expanded ? (
                <ChevronUp style={{ width: "16px", height: "16px" }} />
              ) : (
                <ChevronDown style={{ width: "16px", height: "16px" }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: "1px solid var(--border-light)" }}>
          {/* Timeline */}
          <div
            style={{
              padding: "8px 18px 0",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 4px",
              }}
            >
              Order Status
            </p>
            <Timeline status={order.status} />
          </div>

          {/* Items */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
              }}
            >
              Items Ordered
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {/* Item image - clickable */}
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid var(--border-light)",
                      flexShrink: 0,
                    }}
                  >
                    <Link
                      to={`/product/${item.productId}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.product?.thumbnail || item.thumbnail ? (
                        <img
                          src={item.product?.thumbnail || item.thumbnail}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Package size={18} />
                        </div>
                      )}
                    </Link>
                  </div>
                  {/* Item info */}
                  <div style={{ flex: 1 }}>
                    <Link
                      to={`/product/${item.productId}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {item.title}
                      </p>
                    </Link>

                    <p
                      style={{
                        fontSize: ".8rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>

                  {/* Item total */}
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--border-light)",
              backgroundColor: "var(--bg-section)",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
              }}
            >
              Price Breakdown
            </p>
            {[
              { label: "Subtotal", value: order.subtotal },
              { label: "Shipping", value: order.shipping },
              { label: "Tax (7.5%)", value: order.tax },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    fontWeight: "500",
                  }}
                >
                  {row.label === "Shipping" && row.value === 0
                    ? "FREE"
                    : formatPrice(row.value)}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "8px",
                borderTop: "1px solid var(--border-light)",
                marginTop: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "0.88rem",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  color: "var(--brand)",
                }}
              >
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Shipping address */}
          <div style={{ padding: "14px 18px" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
              }}
            >
              Delivery Details
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <MapPin
                  style={{
                    width: "14px",
                    height: "14px",
                    color: "var(--brand)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {order.street}, {order.city}, {order.state}
                  {order.zip ? `, ${order.zip}` : ""}
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Phone
                  style={{
                    width: "14px",
                    height: "14px",
                    color: "var(--brand)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {order.phone}
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Mail
                  style={{
                    width: "14px",
                    height: "14px",
                    color: "var(--brand)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {order.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════
   MAIN PAGE
══════════════════════════ */
export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Fetch orders on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    apiClient
      .getOrders()
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated]);

  const STATUS_FILTERS = [
    { value: "all", label: "All Orders" },
    { value: "PENDING", label: "Pending" },
    { value: "PAID", label: "Paid" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  /* Not logged in */
  if (!isAuthenticated)
    return (
      <div
        style={{
          backgroundColor: "var(--bg-section)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "380px" }}>
          <ShoppingBag
            style={{
              width: "48px",
              height: "48px",
              color: "var(--text-subtle)",
              margin: "0 auto 16px",
            }}
          />
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.4rem",
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Sign in to view orders
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              marginBottom: "24px",
            }}
          >
            You need to be logged in to view your order history.
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 24px",
              backgroundColor: "var(--brand)",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.875rem",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    );

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
          style={{ maxWidth: "900px", margin: "0 auto", padding: "12px 16px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link
              to="/account"
              style={{
                color: "var(--text-muted)",
                display: "flex",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--brand)")
              }
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
                My Orders
              </h1>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                {loading
                  ? "Loading..."
                  : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "16px 16px 64px",
        }}
      >
        {/* Filter tabs */}
        {!loading && orders.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginBottom: "16px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "99px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  border: "1.5px solid",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                  backgroundColor:
                    filter === f.value ? "var(--brand)" : "var(--bg-card)",
                  borderColor:
                    filter === f.value
                      ? "var(--brand)"
                      : "var(--border-medium)",
                  color: filter === f.value ? "#fff" : "var(--text-secondary)",
                }}
              >
                {f.label}
                {f.value !== "all" && (
                  <span style={{ marginLeft: "5px", opacity: 0.7 }}>
                    ({orders.filter((o) => o.status === f.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}
                  className="shimmer-bg"
                />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      height: "10px",
                      width: "30%",
                      borderRadius: "3px",
                    }}
                    className="shimmer-bg"
                  />
                  <div
                    style={{
                      height: "14px",
                      width: "70%",
                      borderRadius: "3px",
                    }}
                    className="shimmer-bg"
                  />
                  <div
                    style={{
                      height: "10px",
                      width: "40%",
                      borderRadius: "3px",
                    }}
                    className="shimmer-bg"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "16px",
              color: "#dc2626",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "64px 16px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-light)",
            }}
          >
            <ShoppingBag
              style={{
                width: "48px",
                height: "48px",
                color: "var(--text-subtle)",
                margin: "0 auto 16px",
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
              {filter === "all"
                ? "No orders yet"
                : `No ${filter.toLowerCase()} orders`}
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                marginBottom: "20px",
              }}
            >
              {filter === "all"
                ? "When you place an order, it'll appear here."
                : "Try a different filter to see your orders."}
            </p>
            {filter === "all" ? (
              <Link
                to="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 24px",
                  backgroundColor: "var(--brand)",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "0.875rem",
                }}
              >
                Start Shopping
              </Link>
            ) : (
              <button
                onClick={() => setFilter("all")}
                style={{
                  padding: "9px 20px",
                  backgroundColor: "var(--bg-muted)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "8px",
                  color: "var(--text-secondary)",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Show All Orders
              </button>
            )}
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && filtered.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
