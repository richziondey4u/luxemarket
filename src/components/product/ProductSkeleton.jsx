export default function ProductSkeleton({ count = 8 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
        gap: "16px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ebebeb",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{ aspectRatio: "1", width: "100%" }}
            className="shimmer-bg"
          />
          <div
            style={{
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{ height: "9px", width: "30%" }}
              className="shimmer-bg"
            />
            <div
              style={{ height: "13px", width: "90%" }}
              className="shimmer-bg"
            />
            <div
              style={{ height: "9px", width: "55%" }}
              className="shimmer-bg"
            />
            <div
              style={{ height: "16px", width: "40%" }}
              className="shimmer-bg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
