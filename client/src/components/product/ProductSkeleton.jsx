export default function ProductSkeleton({ count = 10 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
        gap: "1px",
        backgroundColor: "var(--border-light)",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ backgroundColor: "var(--bg-card)", padding: "8px" }}
        >
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{ aspectRatio: "1", width: "100%" }}
              className="shimmer-bg"
            />
            <div
              style={{
                padding: "8px 10px 10px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div
                style={{ height: "8px", width: "35%", borderRadius: "3px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "10px", width: "100%", borderRadius: "3px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "10px", width: "75%", borderRadius: "3px" }}
                className="shimmer-bg"
              />
              <div
                style={{ height: "8px", width: "50%", borderRadius: "3px" }}
                className="shimmer-bg"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{ height: "14px", width: "45%", borderRadius: "3px" }}
                  className="shimmer-bg"
                />
                <div
                  style={{ width: "28px", height: "28px", borderRadius: "50%" }}
                  className="shimmer-bg"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
