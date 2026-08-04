import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  User,
  Calendar,
  Hash,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  AlertCircle,
  ShoppingBag,
  FileText,
  ChevronRight,
} from "lucide-react";

import { apiClient } from "../lib/api";
import { formatPrice } from "../api/products";

// ── Status config ─────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING: {
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Pending",
    icon: Clock,
  },
  PAID: {
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    label: "Paid",
    icon: CreditCard,
  },
  PROCESSING: {
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Processing",
    icon: RefreshCw,
  },
  SHIPPED: {
    color: "#06b6d4",
    bg: "#ecfeff",
    border: "#a5f3fc",
    label: "Shipped",
    icon: Truck,
  },
  DELIVERED: {
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    label: "Delivered",
    icon: CheckCircle,
  },
  CANCELLED: {
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    label: "Cancelled",
    icon: XCircle,
  },
  REFUNDED: {
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    label: "Refunded",
    icon: RefreshCw,
  },
};

const TIMELINE_STEPS = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

// ── Sub-components ────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 12px",
        borderRadius: "99px",
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: "0.78rem",
        fontWeight: "700",
      }}
    >
      <Icon size={12} /> {cfg.label}
    </span>
  );
}

function Timeline({ status }) {
  const cancelled = status === "CANCELLED" || status === "REFUNDED";
  const currentIdx = TIMELINE_STEPS.indexOf(status);

  if (cancelled) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
      <div
        style={{
          padding: "20px 24px",
          backgroundColor: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Icon size={18} style={{ color: cfg.color }} />
        <span
          style={{ fontSize: "0.875rem", color: cfg.color, fontWeight: "600" }}
        >
          Order {cfg.label}
        </span>
      </div>
    );
  }

  return (
    <div style={{ padding: "4px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0",
          position: "relative",
        }}
      >
        {TIMELINE_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = idx === currentIdx;
          const cfg = STATUS_CONFIG[step];
          const Icon = cfg.icon;
          const isLast = idx === TIMELINE_STEPS.length - 1;

          return (
            <div
              key={step}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Connector line */}
              {!isLast && (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "50%",
                    width: "100%",
                    height: "2px",
                    backgroundColor:
                      idx < currentIdx ? "var(--brand)" : "var(--border-light)",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Circle */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: done ? "var(--brand)" : "var(--bg-section)",
                  border: `2px solid ${done ? "var(--brand)" : "var(--border-light)"}`,
                  zIndex: 1,
                  flexShrink: 0,
                  boxShadow: active
                    ? "0 0 0 4px rgba(var(--brand-rgb, 79,125,82), 0.15)"
                    : "none",
                  transition: "all 0.3s",
                }}
              >
                <Icon
                  size={14}
                  style={{ color: done ? "#fff" : "var(--text-muted)" }}
                />
              </div>

              {/* Label */}
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "0.65rem",
                  fontWeight: active ? "700" : "500",
                  color: done ? "var(--text-primary)" : "var(--text-muted)",
                  textAlign: "center",
                  lineHeight: "1.3",
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

function Card({ title, icon: Icon, children }) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {title && (
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {Icon && <Icon size={15} style={{ color: "var(--brand)" }} />}
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "700",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>
      )}
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
        padding: "8px 0",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <span
        style={{
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.82rem",
          fontWeight: "500",
          color: "var(--text-primary)",
          textAlign: "right",
          fontFamily: mono ? "monospace" : "inherit",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function Skeleton({
  width = "100%",
  height = "16px",
  radius = "6px",
  style = {},
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: "var(--bg-section)",
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 16px" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <Skeleton
        width="120px"
        height="32px"
        radius="8px"
        style={{ marginBottom: "28px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Skeleton width="200px" height="28px" radius="8px" />
        <Skeleton width="90px" height="26px" radius="99px" />
      </div>
      <Skeleton
        width="100%"
        height="100px"
        radius="12px"
        style={{ marginBottom: "16px" }}
      />
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          width="100%"
          height="80px"
          radius="12px"
          style={{ marginBottom: "12px" }}
        />
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => apiClient.getOrder(id).then((r) => r.data.data.order),
    retry: 1,
  });

  
;

  if (!order) return <p>Loading...</p>;

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (

      <div
        style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 16px" }}
      >
        <button
          onClick={() => navigate("/orders")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            marginBottom: "28px",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to My Orders
        </button>
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "16px",
            padding: "32px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}
        >
          <AlertCircle
            size={22}
            style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }}
          />
          <div>
            <p
              style={{
                fontWeight: "700",
                color: "#991b1b",
                fontSize: "0.95rem",
                marginBottom: "6px",
              }}
            >
              Failed to load order
            </p>
            <p style={{ fontSize: "0.85rem", color: "#b91c1c" }}>
              {error?.message || "Something went wrong. Please try again."}
            </p>
            <button
              onClick={() => navigate("/orders")}
              style={{
                marginTop: "16px",
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#ef4444",
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "32px 16px",
          textAlign: "center",
        }}
      >
        <ShoppingBag
          size={48}
          style={{ color: "var(--text-muted)", margin: "40px auto 16px" }}
        />
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          Order not found
        </p>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            marginBottom: "24px",
          }}
        >
          We couldn't find this order. It may have been removed or you may not
          have access.
        </p>
        <button
          onClick={() => navigate("/orders")}
          style={{
            padding: "10px 24px",
            borderRadius: "10px",
            backgroundColor: "var(--brand)",
            color: "#fff",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  const paymentCfg =
    order.payment?.status === "success"
      ? { color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", label: "Paid" }
      : order.payment?.status === "failed"
        ? {
            color: "#ef4444",
            bg: "#fef2f2",
            border: "#fecaca",
            label: "Failed",
          }
        : {
            color: "#f59e0b",
            bg: "#fffbeb",
            border: "#fde68a",
            label: "Pending",
          };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-section)",
        paddingBottom: "60px",
      }}
    >
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      <div
        style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 16px" }}
      >
        {/* ── Back button ── */}
        <button
          onClick={() => navigate("/orders")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            marginBottom: "24px",
            padding: "6px 0",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          <ArrowLeft size={16} /> Back to My Orders
        </button>

        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.4rem",
                fontWeight: "800",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Order #{order.orderNumber}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "6px",
              }}
            >
              <Calendar size={13} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* ── Timeline ── */}
        <Card title="Order Progress" icon={Clock}>
          <Timeline status={order.status} />
        </Card>

        <div
          style={{
            marginTop: "16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {/* ── Payment info ── */}
          <Card title="Payment" icon={CreditCard}>
            <div style={{ marginBottom: "12px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "3px 10px",
                  borderRadius: "99px",
                  backgroundColor: paymentCfg.bg,
                  color: paymentCfg.color,
                  border: `1px solid ${paymentCfg.border}`,
                  fontSize: "0.72rem",
                  fontWeight: "700",
                }}
              >
                {paymentCfg.label}
              </span>
            </div>
            <div>
              <InfoRow
                label="Provider"
                value={order.payment?.provider || "N/A"}
              />
              <InfoRow
                label="Reference"
                value={order.payment?.reference}
                mono
              />
            </div>
          </Card>

          {/* ── Customer details ── */}
          <Card title="Customer" icon={User}>
            <InfoRow
              label="Name"
              value={`${order.firstName} ${order.lastName}`}
            />
            <InfoRow label="Email" value={order.email} />
            <InfoRow label="Phone" value={order.phone} />
          </Card>
        </div>

        {/* ── Delivery address ── */}
        <div style={{ marginTop: "16px" }}>
          <Card title="Delivery Address" icon={MapPin}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  flexShrink: 0,
                  backgroundColor: "var(--bg-section)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapPin size={16} style={{ color: "var(--brand)" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {order.firstName} {order.lastName}
                </p>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                    lineHeight: "1.6",
                  }}
                >
                  {order.street}
                  <br />
                  {order.city}, {order.state} {order.zip}
                  <br />
                  {order.country}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Notes ── */}
        {order.notes && (
          <div style={{ marginTop: "16px" }}>
            <Card title="Order Notes" icon={FileText}>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                {order.notes}
              </p>
            </Card>
          </div>
        )}

        {/* ── Items ── */}
        <div style={{ marginTop: "16px" }}>
          <Card
            title={`Items (${order.items?.length || 0})`}
            icon={ShoppingBag}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px",
                    borderRadius: "12px",
                    backgroundColor: "var(--bg-section)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.productId}`}
                    style={{ flexShrink: 0, display: "block" }}
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "10px",
                          objectFit: "cover",
                          border: "1px solid var(--border-light)",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "10px",
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-light)",
                        display: item.thumbnail ? "none" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Package
                        size={24}
                        style={{ color: "var(--text-muted)" }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/product/${item.productId}`}
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        display: "block",
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--brand)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-primary)")
                      }
                    >
                      {item.title}
                    </Link>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginBottom: "2px",
                      }}
                    >
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Right: total + view button */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                      }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <Link
                      to={`/product/${item.productId}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "5px 10px",
                        borderRadius: "7px",
                        border: "1px solid var(--border-light)",
                        backgroundColor: "var(--bg-card)",
                        color: "var(--brand)",
                        textDecoration: "none",
                        fontSize: "0.72rem",
                        fontWeight: "600",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--brand)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-card)";
                        e.currentTarget.style.color = "var(--brand)";
                      }}
                    >
                      View Product <ChevronRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Price summary ── */}
        <div style={{ marginTop: "16px" }}>
          <Card title="Order Summary" icon={Hash}>
            <div style={{ maxWidth: "320px", marginLeft: "auto" }}>
              {[
                { label: "Subtotal", value: formatPrice(order.subtotal) },
                {
                  label: "Shipping",
                  value:
                    order.shipping === 0 ? "Free" : formatPrice(order.shipping),
                },
                { label: "Tax", value: formatPrice(order.tax) },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-light)",
                  }}
                >
                  <span
                    style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}

              {/* Grand total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 0 4px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                  }}
                >
                  Grand Total
                </span>
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "800",
                    color: "var(--brand)",
                  }}
                >
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
