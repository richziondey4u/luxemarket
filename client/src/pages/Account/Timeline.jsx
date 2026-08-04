import { getStatusConfig, ORDER_STEPS } from "./orderStatus.js";

export default function OrderTimeline({ status }) {
  const cancelled = status === "CANCELLED" || status === "REFUNDED";

  if (cancelled) {
    const cfg = getStatusConfig(status);
    const Icon = cfg.icon;
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${cfg.bg} ${cfg.border}`}
      >
        <Icon className={`w-5 h-5 ${cfg.text}`} />
        <span className={`text-sm font-semibold ${cfg.text}`}>
          Order {cfg.label}
        </span>
      </div>
    );
  }

  const currentIdx = ORDER_STEPS.indexOf(status);

  return (
    <div className="flex items-start">
      {ORDER_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        const cfg = getStatusConfig(step);
        const Icon = cfg.icon;
        const isLast = idx === ORDER_STEPS.length - 1;

        return (
          <div
            key={step}
            className="flex-1 flex flex-col items-center relative"
          >
            {!isLast && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 ${
                  idx < currentIdx ? "bg-brand-500" : "bg-white/10"
                }`}
              />
            )}
            <div
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done
                  ? "bg-brand-500 border-brand-500"
                  : "bg-slate-900 border-white/15"
              } ${active ? "ring-4 ring-brand-500/20" : ""}`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${done ? "text-slate-950" : "text-slate-500"}`}
              />
            </div>
            <p
              className={`mt-2 text-[10px] font-semibold text-center leading-tight ${
                active
                  ? "text-white"
                  : done
                    ? "text-slate-300"
                    : "text-slate-600"
              }`}
            >
              {cfg.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}