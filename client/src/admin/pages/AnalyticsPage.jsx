import { useMemo } from "react";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import { formatPrice } from "../../api/products.js";

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

const STATUS_COLORS = {
  paid: "#059669",
  pending: "#d97706",
  shipped: "#2563eb",
  delivered: "#059669",
  cancelled: "#dc2626",
};

export default function AnalyticsPage() {
  const orders = getOrders();
  const users = getUsers();

  const stats = useMemo(() => {
    const netRev = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + (o.total || 0), 0);
    const grossRev = orders.reduce((s, o) => s + (o.total || 0), 0);
    const paid = orders.filter((o) =>
      ["paid", "delivered"].includes(o.status),
    ).length;
    const avgOrder = paid > 0 ? netRev / paid : 0;
    const conversion =
      users.length > 0 ? Math.round((orders.length / users.length) * 100) : 0;
    return { netRev, grossRev, paid, avgOrder, conversion };
  }, [orders, users]);

  const statusBreakdown = useMemo(
    () =>
      ["paid", "pending", "shipped", "delivered", "cancelled"].map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1),
        count: orders.filter((o) => o.status === s).length,
        pct:
          orders.length > 0
            ? Math.round(
                (orders.filter((o) => o.status === s).length / orders.length) *
                  100,
              )
            : 0,
        color: STATUS_COLORS[s],
      })),
    [orders],
  );

  const topCustomers = useMemo(
    () =>
      getUsers()
        .map((u) => ({
          ...u,
          spent: orders
            .filter((o) => o.userId === u.id && o.status !== "cancelled")
            .reduce((s, o) => s + (o.total || 0), 0),
          orderCount: orders.filter((o) => o.userId === u.id).length,
        }))
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5),
    [orders],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1
          style={{
            fontSize: "1.1rem",
            fontWeight: "800",
            color: "#111827",
            margin: "0 0 2px",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          Analytics
        </h1>
        <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
          Store performance overview
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
          title="Net Revenue"
          value={formatPrice(stats.netRev)}
          sub="Excl. cancelled"
          trend="+12%"
          trendUp
          color="#4f7d52"
        />
        <StatCard
          icon={<DollarSign style={{ width: "18px", height: "18px" }} />}
          title="Gross Revenue"
          value={formatPrice(stats.grossRev)}
          sub="All orders"
          color="#059669"
        />
        <StatCard
          icon={<ShoppingCart style={{ width: "18px", height: "18px" }} />}
          title="Avg Order"
          value={formatPrice(stats.avgOrder)}
          sub="Per completed order"
          color="#2563eb"
        />
        <StatCard
          icon={<TrendingUp style={{ width: "18px", height: "18px" }} />}
          title="Conversion"
          value={stats.conversion + "%"}
          sub="Orders per customer"
          trend="+3%"
          trendUp
          color="#7c3aed"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "16px",
        }}
      >
        {/* Status breakdown */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "0.88rem",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 14px",
            }}
          >
            Order Status Breakdown
          </h3>
          {orders.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
              No orders yet.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {statusBreakdown.map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "#374151",
                        fontWeight: "500",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "#111827",
                        fontWeight: "700",
                      }}
                    >
                      {item.count} ({item.pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: "7px",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "99px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: item.pct + "%",
                        backgroundColor: item.color,
                        borderRadius: "99px",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top customers */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "0.88rem",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 14px",
            }}
          >
            Top Customers
          </h3>
          {topCustomers.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
              No customers yet.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {topCustomers.map((u, i) => (
                <div
                  key={u.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    paddingBottom: i < 4 ? "10px" : 0,
                    borderBottom: i < 4 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: "800",
                      color: "#9ca3af",
                      width: "16px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    #{i + 1}
                  </span>
                  <img
                    src={u.avatar}
                    alt={u.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "1.5px solid #e5e7eb",
                      flexShrink: 0,
                    }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        color: "#111827",
                        margin: "0 0 1px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {u.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        color: "#9ca3af",
                        margin: 0,
                      }}
                    >
                      {u.orderCount} order{u.orderCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "800",
                      color: "#4f7d52",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatPrice(u.spent)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
