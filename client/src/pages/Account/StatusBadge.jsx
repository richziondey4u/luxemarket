import { getStatusConfig } from "./orderStatus.js";

export default function StatusBadge({ status, size = "sm" }) {
  const cfg = getStatusConfig(status);
  const Icon = cfg.icon;
  const sizing = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} ${sizing}`}
    >
      <Icon className={size === "lg" ? "w-4 h-4" : "w-3 h-3"} />
      {cfg.label}
    </span>
  );
}
