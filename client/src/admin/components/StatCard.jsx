export default function StatCard({
  icon,
  title,
  value,
  sub,
  trend,
  trendUp,
  color = "#4f7d52",
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)")
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: color + "15",
            border: `1px solid ${color}30`,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "0.72rem",
              fontWeight: "700",
              color: trendUp ? "#059669" : "#dc2626",
              backgroundColor: trendUp ? "#d1fae5" : "#fee2e2",
              padding: "2px 8px",
              borderRadius: "99px",
            }}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </div>
        )}
      </div>
      <div>
        <p
          style={{
            fontSize: "0.72rem",
            color: "#6b7280",
            margin: "0 0 4px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: "600",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "800",
            color: "#111827",
            margin: 0,
            fontFamily: "DM Sans, sans-serif",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        {sub && (
          <p
            style={{ fontSize: "0.72rem", color: "#9ca3af", margin: "4px 0 0" }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
