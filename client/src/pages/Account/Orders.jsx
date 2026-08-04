import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Package } from "lucide-react";
import OrderCard from "./OrderCard.jsx";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function Orders() {
  const { orders, loadingOrders, ordersError } = useOutletContext();
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-2xl font-bold text-white">
          My Orders
        </h2>
        {!loadingOrders && orders.length > 0 && (
          <span className="text-xs text-slate-500">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </span>
        )}
      </div>

      {/* Filter pills */}
      {!loadingOrders && orders.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => {
            const count =
              f.value === "all"
                ? orders.length
                : orders.filter((o) => o.status === f.value).length;
            if (f.value !== "all" && count === 0) return null;
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  active
                    ? "bg-brand-500 border-brand-500 text-slate-950"
                    : "bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/25"
                }`}
              >
                {f.label} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Loading */}
      {loadingOrders && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl border border-white/8 bg-white/[0.02] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!loadingOrders && ordersError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-400">
          {ordersError}
        </div>
      )}

      {/* Empty */}
      {!loadingOrders && !ordersError && filtered.length === 0 && (
        <div className="card-dark rounded-2xl p-10 border border-white/8 text-center">
          <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">
            {filter === "all"
              ? "No orders yet."
              : `No ${filter.toLowerCase()} orders.`}
          </p>
          {filter === "all" ? (
            <Link to="/" className="btn-primary text-sm">
              Start Shopping
            </Link>
          ) : (
            <button
              onClick={() => setFilter("all")}
              className="btn-secondary text-sm"
            >
              Show All Orders
            </button>
          )}
        </div>
      )}

      {/* List */}
      {!loadingOrders && !ordersError && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
