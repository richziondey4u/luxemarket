import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "../../api/products.js";
import { formatDate } from "../../lib/utils.js";
import StatusBadge from "./StatusBadge.jsx";
import OrderTimeline from "./Timeline.jsx";

export default function OrderCard({ order, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const firstItem = order.items?.[0];
  const thumb = firstItem?.product?.thumbnail || firstItem?.thumbnail;

  return (
    <div className="card-dark rounded-2xl border border-white/8 overflow-hidden hover:border-white/15 transition-colors">
      {/* Header - toggles expand */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
            {thumb ? (
              <img
                src={thumb}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-5 h-5 text-slate-600" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-mono text-slate-500 mb-0.5">
              #{order.orderNumber || order.id}
            </p>
            <p className="text-sm font-semibold text-white truncate">
              {order.items?.length === 1
                ? order.items[0].title
                : `${order.items?.[0]?.title} + ${(order.items?.length || 1) - 1} more`}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatDate(order.createdAt)} · {order.items?.length} item
              {order.items?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <StatusBadge status={order.status} />
          <p className="text-sm font-bold text-white">
            {formatPrice(order.total)}
          </p>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-white/8">
          {/* Timeline */}
          <div className="px-4 pt-4 pb-2 border-b border-white/8">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Order Status
            </p>
            <OrderTimeline status={order.status} />
          </div>

          {/* Items */}
          <div className="px-4 py-4 border-b border-white/8 space-y-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Items Ordered
            </p>
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <Link
                  to={`/product/${item.productId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0"
                >
                  {item.product?.thumbnail || item.thumbnail ? (
                    <img
                      src={item.product?.thumbnail || item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.productId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-medium text-white hover:text-brand-400 transition-colors truncate block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-white whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="px-4 py-4 border-b border-white/8 bg-white/[0.02]">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Price Breakdown
            </p>
            {[
              { label: "Subtotal", value: order.subtotal },
              { label: "Shipping", value: order.shipping },
              { label: "Tax", value: order.tax },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between mb-1.5 text-sm"
              >
                <span className="text-slate-500">{row.label}</span>
                <span className="text-slate-300 font-medium">
                  {row.label === "Shipping" && row.value === 0
                    ? "FREE"
                    : formatPrice(row.value)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 mt-1 border-t border-white/8">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-base font-bold text-brand-400">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Delivery + footer */}
          <div className="px-4 py-4 flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5 min-w-0">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Delivery Details
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                {order.street}, {order.city}, {order.state}
                {order.zip ? `, ${order.zip}` : ""}
              </div>
              {order.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  {order.phone}
                </div>
              )}
              {order.email && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  {order.email}
                </div>
              )}
            </div>

            <Link
              to={`/account/orders/${order.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex-shrink-0"
            >
              View Full Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}