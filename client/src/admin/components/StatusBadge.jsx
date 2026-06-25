const CFG = {
  paid: { label: "Paid", color: "#059669", bg: "#d1fae5" },
  pending: { label: "Pending", color: "#d97706", bg: "#fef3c7" },
  shipped: { label: "Shipped", color: "#2563eb", bg: "#dbeafe" },
  delivered: { label: "Delivered", color: "#059669", bg: "#d1fae5" },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2" },
  active: { label: "Active", color: "#059669", bg: "#d1fae5" },
  inactive: { label: "Inactive", color: "#6b7280", bg: "#f3f4f6" },
};

export default function StatusBadge({ status }) {
  const cfg = CFG[status] || CFG.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 9px",
        borderRadius: "99px",
        fontSize: "0.68rem",
        fontWeight: "700",
        backgroundColor: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  );
}
