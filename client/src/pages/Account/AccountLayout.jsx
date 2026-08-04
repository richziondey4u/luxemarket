import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { User, Package, Heart, MapPin, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { apiClient } from "../../lib/api.js";
import { formatDate } from "../../lib/utils.js";

const TABS = [
  { key: "overview", path: "/account", label: "Overview", icon: User },
  { key: "orders", path: "/account/orders", label: "Orders", icon: Package },
  {
    key: "wishlist",
    path: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  { key: "address", path: "/account/address", label: "Address", icon: MapPin },
  {
    key: "settings",
    path: "/account/settings",
    label: "Settings",
    icon: Settings,
  },
];

const cn = (...c) => c.filter(Boolean).join(" ");

export default function AccountLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { items: wishItems } = useWishlist();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await apiClient.getOrders();
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
        setOrdersError(err.message || "Failed to load orders.");
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, []);

  const tab = (() => {
    const segment = location.pathname.replace(/^\/account\/?/, "");
    return segment.split("/")[0] || "overview";
  })();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-dark rounded-2xl p-5 border border-white/8 mb-4 text-center">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full border-2 border-brand-500/40 mx-auto mb-3"
            />
            <h3 className="font-semibold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
            <p className="text-xs text-brand-400 mt-1 font-medium">
              Member since{" "}
              {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
            </p>
          </div>

          <div className="card-dark rounded-2xl border border-white/8 overflow-hidden">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.key;
              return (
                <Link
                  key={t.key}
                  to={t.path}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2",
                    isActive
                      ? "border-brand-500 bg-brand-500/10 text-brand-400"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                  {t.key === "wishlist" && wishItems.length > 0 && (
                    <span className="ml-auto badge-hot text-xs px-1.5 py-0.5">
                      {wishItems.length}
                    </span>
                  )}
                  {t.key === "orders" && orders.length > 0 && (
                    <span className="ml-auto badge-new text-xs px-1.5 py-0.5">
                      {orders.length}
                    </span>
                  )}
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors border-l-2 border-transparent"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Main - active tab renders here */}
        <div className="lg:col-span-3">
          <Outlet context={{ orders, loadingOrders, ordersError }} />
        </div>
      </div>
    </div>
  );
}
