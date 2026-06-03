export default function ProductSkeleton({ count = 8 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ebebeb",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <div style={{ aspectRatio: "1" }} className="shimmer-bg" />
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{ height: "10px", width: "33%" }}
              className="shimmer-bg rounded"
            />
            <div
              style={{ height: "14px", width: "100%" }}
              className="shimmer-bg rounded"
            />
            <div
              style={{ height: "10px", width: "60%" }}
              className="shimmer-bg rounded"
            />
            <div
              style={{ height: "18px", width: "45%" }}
              className="shimmer-bg rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
