import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  User,
  Calendar,
  Hash,
  AlertCircle,
  ShoppingBag,
  FileText,
  ChevronRight,
  Clock,
} from "lucide-react";
import { apiClient } from "../../lib/api.js";
import { formatPrice } from "../../api/products.js";
import StatusBadge from "./StatusBadge.jsx";
import OrderTimeline from "./Timeline.jsx";

function Card({ title, icon: Icon, children }) {
  return (
    <div className="card-dark rounded-2xl border border-white/8 overflow-hidden">
      {title && (
        <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-brand-400" />}
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex justify-between items-start gap-3 py-2 border-b border-white/8 last:border-b-0">
      <span className="text-xs text-slate-500 flex-shrink-0">{label}</span>
      <span
        className={`text-sm text-white text-right font-medium ${mono ? "font-mono" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function Skeleton({ className }) {
  return <div className={`bg-white/5 animate-pulse rounded-lg ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-32 h-8" />
      <div className="flex justify-between items-center">
        <Skeleton className="w-48 h-7" />
        <Skeleton className="w-24 h-7 rounded-full" />
      </div>
      <Skeleton className="w-full h-28" />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full h-20" />
      ))}
    </div>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => apiClient.getOrder(id).then((r) => r.data.data.order),
    retry: 1,
  });

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/account/orders")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </button>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-400 mb-1">Failed to load order</p>
            <p className="text-sm text-red-400/80">
              {error?.message || "Something went wrong. Please try again."}
            </p>
            <button
              onClick={() => navigate("/account/orders")}
              className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <p className="text-lg font-semibold text-white mb-2">Order not found</p>
        <p className="text-sm text-slate-500 mb-6">
          We couldn't find this order. It may have been removed or you may not
          have access.
        </p>
        <button
          onClick={() => navigate("/account/orders")}
          className="btn-primary text-sm"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  const paymentCfg =
    order.payment?.status === "success"
      ? {
          text: "text-green-400",
          bg: "bg-green-500/15",
          border: "border-green-500/30",
          label: "Paid",
        }
      : order.payment?.status === "failed"
        ? {
            text: "text-red-400",
            bg: "bg-red-500/15",
            border: "border-red-500/30",
            label: "Failed",
          }
        : {
            text: "text-amber-400",
            bg: "bg-amber-500/15",
            border: "border-amber-500/30",
            label: "Pending",
          };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/account/orders")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </button>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Order #{order.orderNumber}
          </h1>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        <StatusBadge status={order.status} size="lg" />
      </div>

      {/* Timeline */}
      <Card title="Order Progress" icon={Clock}>
        <OrderTimeline status={order.status} />
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Payment" icon={CreditCard}>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold mb-3 ${paymentCfg.bg} ${paymentCfg.text} ${paymentCfg.border}`}
          >
            {paymentCfg.label}
          </span>
          <InfoRow label="Provider" value={order.payment?.provider || "N/A"} />
          <InfoRow label="Reference" value={order.payment?.reference} mono />
        </Card>

        <Card title="Customer" icon={User}>
          <InfoRow
            label="Name"
            value={`${order.firstName} ${order.lastName}`}
          />
          <InfoRow label="Email" value={order.email} />
          <InfoRow label="Phone" value={order.phone} />
        </Card>
      </div>

      <Card title="Delivery Address" icon={MapPin}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">
              {order.firstName} {order.lastName}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {order.street}
              <br />
              {order.city}, {order.state} {order.zip}
              <br />
              {order.country}
            </p>
          </div>
        </div>
      </Card>

      {order.notes && (
        <Card title="Order Notes" icon={FileText}>
          <p className="text-sm text-slate-400 leading-relaxed">
            {order.notes}
          </p>
        </Card>
      )}

      <Card title={`Items (${order.items?.length || 0})`} icon={ShoppingBag}>
        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/8"
            >
              <Link
                to={`/product/${item.productId}`}
                className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-white/5"
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full items-center justify-center"
                  style={{ display: item.thumbnail ? "none" : "flex" }}
                >
                  <Package className="w-6 h-6 text-slate-600" />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.productId}`}
                  className="text-sm font-semibold text-white hover:text-brand-400 transition-colors truncate block mb-1"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-slate-500">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <p className="text-sm font-bold text-white">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <Link
                  to={`/product/${item.productId}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-white/10 text-brand-400 text-xs font-semibold hover:bg-brand-500 hover:text-slate-950 hover:border-brand-500 transition-colors"
                >
                  View <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Order Summary" icon={Hash}>
        <div className="max-w-xs ml-auto">
          {[
            { label: "Subtotal", value: formatPrice(order.subtotal) },
            {
              label: "Shipping",
              value:
                order.shipping === 0 ? "Free" : formatPrice(order.shipping),
            },
            { label: "Tax", value: formatPrice(order.tax) },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-2 border-b border-white/8 text-sm"
            >
              <span className="text-slate-500">{row.label}</span>
              <span className="text-slate-300 font-medium">{row.value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3.5">
            <span className="text-sm font-bold text-white">Grand Total</span>
            <span className="text-lg font-bold text-brand-400">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
