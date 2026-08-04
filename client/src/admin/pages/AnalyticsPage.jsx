import { useMemo, useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import { formatPrice } from "../../api/products.js";
import { apiClient } from "../../lib/api.js";

const STATUS_COLORS = {
  paid: "#059669",
  pending: "#d97706",
  shipped: "#2563eb",
  delivered: "#059669",
  cancelled: "#dc2626",
};

export default function AnalyticsPage() {

  const [analytics, setAnalytics] = useState({
  thisMonthRevenue: 0,
  lastMonthRevenue: 0,
  thisMonthOrders: 0,
  revenueGrowth: null,
  ordersByStatus: [],
  topProducts: [],
});

const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadAnalytics = async () => {
    try {
      const res = await apiClient.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadAnalytics();
}, []);

if (loading)
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="loader" />
    </div>
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
          value={formatPrice(analytics.thisMonthRevenue)}
          sub="Excl. cancelled"
          trend="+12%"
          trendUp
          color="#4f7d52"
        />
        <StatCard
          icon={<DollarSign style={{ width: "18px", height: "18px" }} />}
          title="Gross Revenue"
          value={formatPrice(analytics.lastMonthRevenue)}
          sub="All orders"
          color="#059669"
        />
        <StatCard
          icon={<ShoppingCart style={{ width: "18px", height: "18px" }} />}
          title="Avg Order"
          value={analytics.thisMonthOrders}
          sub="Per completed order"
          color="#2563eb"
        />
        <StatCard
          icon={<TrendingUp style={{ width: "18px", height: "18px" }} />}
          title="Conversion"
          value={
            analytics.revenueGrowth ? `${analytics.revenueGrowth}%` : "N/A"
          }
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
          {analytics.ordersByStatus.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
              No orders yet.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {analytics.ordersByStatus.map((item) => (
                <div key={item.status}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ textTransform: "capitalize" }}>
                      {item.status.toLowerCase()}
                    </span>

                    <span>{item._count.status}</span>
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
            Top Selling Products
          </h3>
          {analytics.topProducts.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
              No products yet.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {analytics.topProducts.map((p, i) => (
                <div
                  key={p.productId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>
                    #{i + 1} {p.title}
                  </span>

                  <span style={{ color: "#4f7d52", fontWeight: "700" }}>
                    {p._sum.quantity} sold
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
