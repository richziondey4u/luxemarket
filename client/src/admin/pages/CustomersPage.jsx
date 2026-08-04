import { useState, useEffect, useMemo } from "react";
import { Search, Users, RefreshCw } from "lucide-react";
import { formatPrice } from "../../api/products.js";
import { formatDate } from "../../lib/utils.js";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiFetch(path) {
  const res = await fetch(`${API}${path}`, { credentials: "include" });
  const d = await res.json();
  if (!res.ok) throw new Error(d.message || "Failed");
  return d;
}

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      // Fetch ALL users from DB — no role filter so you see all 3
      const [uRes, oRes] = await Promise.allSettled([
        apiFetch("/admin/users?limit=100"),
        apiFetch("/admin/orders?limit=500"),
      ]);
      if (uRes.status === "fulfilled") setUsers(uRes.value.data?.users || []);
      if (oRes.status === "fulfilled") setOrders(oRes.value.data?.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const enriched = useMemo(
    () =>
      users.map((u) => ({
        ...u,
        orderCount: orders.filter((o) => o.userId === u.id).length,
        spent: orders
          .filter((o) => o.userId === u.id && o.status !== "CANCELLED")
          .reduce((s, o) => s + (o.total || 0), 0),
      })),
    [users, orders],
  );

  const filtered = enriched
    .filter((u) => {
      const q = search.toLowerCase();
      return (
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.spent - a.spent);

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
            Customers
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
            {filtered.length} account{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={load}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "7px 14px",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "7px",
            color: "#374151",
            fontSize: "0.78rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <RefreshCw style={{ width: "13px", height: "13px" }} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
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
          placeholder="Search by name or email..."
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
        {loading ? (
          <div
            style={{ padding: "48px", textAlign: "center", color: "#9ca3af" }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                border: "3px solid #e5e7eb",
                borderTopColor: "#4f7d52",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 10px",
              }}
            />
            Loading customers...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <Users
              style={{
                width: "36px",
                height: "36px",
                color: "#9ca3af",
                margin: "0 auto 10px",
              }}
            />
            <p
              style={{
                color: "#374151",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              {users.length === 0
                ? "No registered customers yet"
                : "No results found"}
            </p>
            <p style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
              {users.length === 0
                ? "Customers appear here after they register on the store."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "600px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {[
                    "Customer",
                    "Email",
                    "Role",
                    "Orders",
                    "Total Spent",
                    "Joined",
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
                        borderBottom: "1px solid #e5e7eb",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    style={{ borderTop: "1px solid #f3f4f6" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fafafa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={{ padding: "10px 14px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <img
                          src={
                            user.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || "U")}&backgroundColor=4f7d52&textColor=ffffff`
                          }
                          alt={user.name}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "1.5px solid #e5e7eb",
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/32x32/4f7d52/white?text=${(user.name || "U").charAt(0)}`;
                          }}
                        />
                        <div>
                          <p
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              color: "#111827",
                              margin: 0,
                            }}
                          >
                            {user.name}
                          </p>
                          {i === 0 && filtered.length > 1 && user.spent > 0 && (
                            <span
                              style={{
                                fontSize: "0.6rem",
                                backgroundColor: "#fef3c7",
                                color: "#d97706",
                                padding: "1px 5px",
                                borderRadius: "3px",
                                fontWeight: "700",
                              }}
                            >
                              Top Buyer
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      {user.email}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "99px",
                          backgroundColor:
                            user.role === "USER" ? "#f0fdf4" : "#fef3f2",
                          color: user.role === "USER" ? "#4f7d52" : "#dc2626",
                          textTransform: "capitalize",
                        }}
                      >
                        {user.role?.toLowerCase() || "user"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: "0.82rem",
                        fontWeight: "700",
                        color: "#111827",
                        textAlign: "center",
                      }}
                    >
                      {user.orderCount}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: "0.82rem",
                        fontWeight: "800",
                        color: "#4f7d52",
                      }}
                    >
                      {formatPrice(user.spent)}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: "0.72rem",
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.createdAt ? formatDate(user.createdAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
