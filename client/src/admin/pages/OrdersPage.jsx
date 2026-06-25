import { useState, useMemo } from "react";
import { Search, Download, RefreshCw, Trash2, Filter } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatPrice } from "../../api/products.js";
import { formatDate } from "../../lib/utils.js";
import toast from "react-hot-toast";

const getOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("lm_orders") || "[]");
  } catch {
    return [];
  }
};
const saveOrders = (o) => localStorage.setItem("lm_orders", JSON.stringify(o));

const STATUS_LIST = [
  "all",
  "paid",
  "pending",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(getOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const refresh = () => setOrders(getOrders());

  const filtered = useMemo(
    () =>
      orders
        .filter((o) => {
          const q = search.toLowerCase();
          const ok =
            !q ||
            o.id?.toLowerCase().includes(q) ||
            `${o.shippingAddress?.firstName} ${o.shippingAddress?.lastName}`
              .toLowerCase()
              .includes(q) ||
            o.shippingAddress?.email?.toLowerCase().includes(q);
          return ok && (statusFilter === "all" || o.status === statusFilter);
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders, search, statusFilter],
  );

  const updateStatus = (id, status) => {
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    saveOrders(next);
    setOrders(next);
    toast.success(`Order updated to "${status}"`);
  };

  const deleteOrder = (id) => {
    if (!confirm(`Delete ${id}?`)) return;
    const next = orders.filter((o) => o.id !== id);
    saveOrders(next);
    setOrders(next);
    toast.success("Order deleted");
  };

  const exportCSV = () => {
    const rows = [
      [
        "ID",
        "Customer",
        "Email",
        "Phone",
        "City",
        "State",
        "Status",
        "Total",
        "Date",
      ],
      ...orders.map((o) => [
        o.id,
        `${o.shippingAddress?.firstName || ""} ${o.shippingAddress?.lastName || ""}`.trim(),
        o.shippingAddress?.email || "",
        o.shippingAddress?.phone || "",
        o.shippingAddress?.city || "",
        o.shippingAddress?.state || "",
        o.status,
        formatPrice(o.total),
        formatDate(o.createdAt),
      ]),
    ];
    const blob = new Blob(
      [rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")],
      { type: "text/csv" },
    );
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: "orders.csv",
    });
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("CSV exported!");
  };

  const btn = (label, action, icon, variant = "default") => {
    const styles = {
      default: { bg: "#fff", border: "#e5e7eb", color: "#374151" },
      green: { bg: "#4f7d52", border: "#4f7d52", color: "#fff" },
      red: { bg: "#fef2f2", border: "#fecaca", color: "#dc2626" },
    }[variant];
    return (
      <button
        onClick={action}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "7px 14px",
          backgroundColor: styles.bg,
          border: `1px solid ${styles.border}`,
          borderRadius: "7px",
          color: styles.color,
          fontSize: "0.78rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "opacity 0.15s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {icon} {label}
      </button>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
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
            Orders
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
            {filtered.length} of {orders.length} orders
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {btn(
            "Refresh",
            refresh,
            <RefreshCw style={{ width: "13px", height: "13px" }} />,
          )}
          {btn(
            "Export CSV",
            exportCSV,
            <Download style={{ width: "13px", height: "13px" }} />,
            "green",
          )}
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "14px",
              height: "14px",
              color: "#9ca3af",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer name..."
            style={{
              width: "100%",
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "7px",
              padding: "8px 10px 8px 32px",
              fontSize: "0.78rem",
              outline: "none",
              color: "#111827",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#4f7d52")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
        </div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {STATUS_LIST.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.72rem",
                fontWeight: "600",
                border: "1px solid",
                cursor: "pointer",
                textTransform: "capitalize",
                backgroundColor: statusFilter === s ? "#4f7d52" : "#fff",
                borderColor: statusFilter === s ? "#4f7d52" : "#e5e7eb",
                color: statusFilter === s ? "#fff" : "#6b7280",
                transition: "all 0.15s",
              }}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "0.875rem",
            }}
          >
            No orders match your filters.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "720px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Status",
                    "Total",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        fontSize: "0.62rem",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        whiteSpace: "nowrap",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
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
                        padding: "10px 14px",
                        fontFamily: "monospace",
                        color: "#4f7d52",
                        fontWeight: "700",
                        fontSize: "0.72rem",
                      }}
                    >
                      {order.id}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          color: "#111827",
                          margin: "0 0 1px",
                        }}
                      >
                        {order.shippingAddress?.firstName}{" "}
                        {order.shippingAddress?.lastName}
                      </p>
                      <p
                        style={{
                          fontSize: "0.68rem",
                          color: "#9ca3af",
                          margin: 0,
                        }}
                      >
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}
                      </p>
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: "0.78rem",
                        color: "#6b7280",
                      }}
                    >
                      {order.items?.length || 0} item(s)
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          fontSize: "0.72rem",
                          padding: "4px 8px",
                          backgroundColor: "#fff",
                          color: "#374151",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        {[
                          "paid",
                          "pending",
                          "shipped",
                          "delivered",
                          "cancelled",
                        ].map((s) => (
                          <option
                            key={s}
                            value={s}
                            style={{ textTransform: "capitalize" }}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: "0.82rem",
                        fontWeight: "700",
                        color: "#111827",
                      }}
                    >
                      {formatPrice(order.total)}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: "0.72rem",
                        color: "#6b7280",
                      }}
                    >
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        style={{
                          padding: "5px 8px",
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: "6px",
                          cursor: "pointer",
                          color: "#dc2626",
                          display: "flex",
                          alignItems: "center",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fee2e2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fef2f2")
                        }
                      >
                        <Trash2 style={{ width: "13px", height: "13px" }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
