import { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { formatPrice } from "../../api/products.js";
import { formatDate } from "../../lib/utils.js";

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("lm_users") || "[]");
  } catch {
    return [];
  }
};
const getOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("lm_orders") || "[]");
  } catch {
    return [];
  }
};

export default function CustomersPage() {
  const users = getUsers();
  const orders = getOrders();
  const [search, setSearch] = useState("");

  const enriched = useMemo(
    () =>
      users.map((u) => {
        const userOrders = orders.filter((o) => o.userId === u.id);
        const spent = userOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((s, o) => s + (o.total || 0), 0);
        return { ...u, orderCount: userOrders.length, spent };
      }),
    [users, orders],
  );

  const filtered = enriched
    .filter((u) => {
      const q = search.toLowerCase();
      return (
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
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
            {filtered.length} registered accounts
          </p>
        </div>
      </div>

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
          placeholder="Search by name, email, or phone..."
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
              {users.length === 0 ? "No customers yet" : "No results found"}
            </p>
            <p style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
              Customers will appear here after they register.
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
                    "Phone",
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
                          src={user.avatar}
                          alt={user.name}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "1.5px solid #e5e7eb",
                            flexShrink: 0,
                          }}
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
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
                          {i === 0 && filtered.length > 1 && (
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
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      {user.phone || "—"}
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
                      {formatDate(user.createdAt)}
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
