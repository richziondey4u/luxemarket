import {
  Clock,
  CreditCard,
  RefreshCw,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const ORDER_STATUS = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    text: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
  },
  PAID: {
    label: "Paid",
    icon: CreditCard,
    text: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
  },
  PROCESSING: {
    label: "Processing",
    icon: RefreshCw,
    text: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    text: "text-cyan-400",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/30",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle,
    text: "text-green-400",
    bg: "bg-green-500/15",
    border: "border-green-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    text: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
  },
  REFUNDED: {
    label: "Refunded",
    icon: RefreshCw,
    text: "text-slate-400",
    bg: "bg-slate-500/15",
    border: "border-slate-500/30",
  },
};

export const ORDER_STEPS = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export function getStatusConfig(status) {
  return ORDER_STATUS[status] || ORDER_STATUS.PENDING;
}