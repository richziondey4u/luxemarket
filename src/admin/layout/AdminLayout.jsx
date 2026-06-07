import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Shield,
  Eye,
  ChevronRight,
  Store,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const G = {
  bg: "#ffffff",
  sidebar: "#ffffff",
  header: "#ffffff",
  border: "#e5e7eb",
  muted: "#f9fafb",
  brand: "#4f7d52",
  brandDark: "#3d6440",
  brandLight: "#f0fdf4",
  brandMid: "#a3c4a5",
  text: "#111827",
  textSub: "#6b7280",
  textMuted: "#9ca3af",
};

export default function AdminLayout({ children, pendingOrders = 0 }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: "20px 16px 14px",
          borderBottom: `1px solid ${G.border}`,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: G.brand,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(79,125,82,0.3)",
            }}
          >
            <Shield style={{ width: "18px", height: "18px", color: "#fff" }} />
          </div>
          <div>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: "800",
                color: G.text,
                margin: 0,
                fontFamily: "Georgia, serif",
              }}
            >
              LuxeMarket
            </p>
            <p
              style={{
                fontSize: "0.6rem",
                color: G.textMuted,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: "600",
              }}
            >
              Admin Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Admin profile strip */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: `1px solid ${G.border}`,
          backgroundColor: G.brandLight,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <img
            src={admin?.avatar}
            alt={admin?.name}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: `2px solid ${G.brandMid}`,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: "700",
                color: G.text,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {admin?.name}
            </p>
            <p
              style={{
                fontSize: "0.65rem",
                color: G.brand,
                margin: 0,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {admin?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
        <p
          style={{
            fontSize: "0.6rem",
            fontWeight: "700",
            color: G.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "8px 8px 4px",
            margin: 0,
          }}
        >
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "9px",
                textDecoration: "none",
                marginBottom: "2px",
                transition: "all 0.15s",
                backgroundColor: isActive ? G.brandLight : "transparent",
                color: isActive ? G.brand : G.textSub,
                fontWeight: isActive ? "700" : "500",
                fontSize: "0.85rem",
                borderLeft: isActive
                  ? `3px solid ${G.brand}`
                  : "3px solid transparent",
              })}
            >
              <Icon style={{ width: "16px", height: "16px", flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.label === "Orders" && pendingOrders > 0 && (
                <span
                  style={{
                    backgroundColor: "#f97316",
                    color: "#fff",
                    fontSize: "0.6rem",
                    fontWeight: "800",
                    padding: "1px 6px",
                    borderRadius: "99px",
                  }}
                >
                  {pendingOrders}
                </span>
              )}
            </NavLink>
          );
        })}

        <hr
          style={{
            border: "none",
            borderTop: `1px solid ${G.border}`,
            margin: "10px 0",
          }}
        />

        <Link
          to="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "9px",
            textDecoration: "none",
            color: G.textSub,
            fontSize: "0.85rem",
            fontWeight: "500",
            marginBottom: "2px",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = G.muted)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Store style={{ width: "16px", height: "16px" }} /> View Store
        </Link>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "9px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#dc2626",
            fontSize: "0.85rem",
            fontWeight: "500",
            textAlign: "left",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#fef2f2")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <LogOut style={{ width: "16px", height: "16px" }} /> Sign Out
        </button>
      </nav>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f9fafb",
        overflow: "hidden",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* Desktop sidebar */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          backgroundColor: G.sidebar,
          borderRight: `1px solid ${G.border}`,
          height: "100vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        className="admin-desk-sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 200,
            }}
          />
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              width: "240px",
              backgroundColor: G.sidebar,
              borderRight: `1px solid ${G.border}`,
              zIndex: 201,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                display: "flex",
                justifyContent: "flex-end",
                borderBottom: `1px solid ${G.border}`,
              }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: G.textMuted,
                  display: "flex",
                }}
              >
                <X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>
            <SidebarContent />
          </div>
        </>
      )}

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: G.header,
            borderBottom: `1px solid ${G.border}`,
            padding: "0 20px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexShrink: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="admin-mob-btn"
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: G.textSub,
                padding: "4px",
              }}
            >
              <Menu style={{ width: "20px", height: "20px" }} />
            </button>
            {/* Breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.78rem",
                color: G.textMuted,
              }}
            >
              <Shield
                style={{ width: "13px", height: "13px", color: G.brand }}
              />
              <ChevronRight style={{ width: "12px", height: "12px" }} />
              <span style={{ color: G.text, fontWeight: "600" }}>Admin</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: G.textSub,
                padding: "6px",
                borderRadius: "8px",
                display: "flex",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = G.muted)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Bell style={{ width: "18px", height: "18px" }} />
              {pendingOrders > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#f97316",
                    borderRadius: "50%",
                    fontSize: "8px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                  }}
                >
                  {pendingOrders}
                </span>
              )}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: G.brandLight,
                border: `1px solid ${G.brandMid}`,
                borderRadius: "99px",
                padding: "4px 12px 4px 6px",
              }}
            >
              <img
                src={admin?.avatar}
                alt={admin?.name}
                style={{ width: "24px", height: "24px", borderRadius: "50%" }}
              />
              <div>
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    color: G.text,
                    margin: 0,
                  }}
                >
                  {admin?.name?.split(" ")[0]}
                </p>
                <p
                  style={{
                    fontSize: "0.6rem",
                    color: G.brand,
                    margin: 0,
                    textTransform: "capitalize",
                  }}
                >
                  {admin?.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            backgroundColor: "#f9fafb",
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-desk-sidebar { display: none !important; }
          .admin-mob-btn      { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
