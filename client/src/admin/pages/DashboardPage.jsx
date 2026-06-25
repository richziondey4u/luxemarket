import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Package,
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatPrice, CATEGORIES } from "../../api/products.js";
import { formatDate } from "../../lib/utils.js";

const getOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("lm_orders") || "[]");
  } catch {
    return [];
  }
};
const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("lm_users") || "[]");
  } catch {
    return [];
  }
};

export default function DashboardPage() {
  const orders = getOrders();
  const users = getUsers();

  const stats = useMemo(
    () => ({
      revenue: orders
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + (o.total || 0), 0),
      total: orders.length,
      paid: orders.filter((o) => ["paid", "delivered"].includes(o.status))
        .length,
      pending: orders.filter((o) => o.status === "pending").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      customers: users.length,
    }),
    [orders, users],
  );

  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: "800",
            color: "#111827",
            margin: "0 0 4px",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: 0 }}>
          Welcome back! Here's your store overview.
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 180px), 1fr))",
          gap: "12px",
        }}
      >
        <StatCard
          icon={<DollarSign style={{ width: "18px", height: "18px" }} />}
          title="Revenue"
          value={formatPrice(stats.revenue)}
          sub="Net (excl. cancelled)"
          trend="+12%"
          trendUp
          color="#4f7d52"
        />
        <StatCard
          icon={<ShoppingCart style={{ width: "18px", height: "18px" }} />}
          title="Orders"
          value={stats.total}
          sub={`${stats.paid} completed`}
          trend="+8%"
          trendUp
          color="#2563eb"
        />
        <StatCard
          icon={<Users style={{ width: "18px", height: "18px" }} />}
          title="Customers"
          value={stats.customers}
          sub="Registered accounts"
          trend="+5%"
          trendUp
          color="#7c3aed"
        />
        <StatCard
          icon={<Clock style={{ width: "18px", height: "18px" }} />}
          title="Pending"
          value={stats.pending}
          sub="Need attention"
          color="#d97706"
        />
        <StatCard
          icon={<CheckCircle style={{ width: "18px", height: "18px" }} />}
          title="Completed"
          value={stats.paid}
          sub="Paid & delivered"
          color="#059669"
        />
        <StatCard
          icon={<XCircle style={{ width: "18px", height: "18px" }} />}
          title="Cancelled"
          value={stats.cancelled}
          sub="Refunded orders"
          color="#dc2626"
        />
      </div>

      {/* Recent orders + Categories */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        {/* Recent orders */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                fontSize: "0.88rem",
                fontWeight: "700",
                color: "#111827",
                margin: 0,
              }}
            >
              Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              style={{
                fontSize: "0.72rem",
                color: "#4f7d52",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div
              style={{
                padding: "32px",
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "0.82rem",
              }}
            >
              No orders yet.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "360px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f9fafb" }}>
                    {["Order", "Customer", "Status", "Total"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 14px",
                          textAlign: "left",
                          fontSize: "0.62rem",
                          fontWeight: "700",
                          color: "#6b7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr
                      key={o.id}
                      style={{ borderTop: "1px solid #f3f4f6" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fafafa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "9px 14px",
                          fontFamily: "monospace",
                          color: "#4f7d52",
                          fontWeight: "700",
                          fontSize: "0.7rem",
                        }}
                      >
                        {o.id?.slice(0, 12)}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          fontSize: "0.78rem",
                          color: "#374151",
                          maxWidth: "120px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {o.shippingAddress?.firstName}{" "}
                        {o.shippingAddress?.lastName}
                      </td>
                      <td style={{ padding: "9px 14px" }}>
                        <StatusBadge status={o.status} />
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          fontSize: "0.78rem",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        {formatPrice(o.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Categories */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "0.88rem",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 12px",
            }}
          >
            Store Categories
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 120px), 1fr))",
              gap: "6px",
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 10px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  fontSize: "0.72rem",
                  color: "#374151",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#4f7d52";
                  e.currentTarget.style.backgroundColor = "#f0fdf4";
                  e.currentTarget.style.color = "#4f7d52";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.color = "#374151";
                }}
              >
                <span style={{ fontSize: "1rem" }}>{cat.icon}</span>
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
