export default function AdminTable({
  columns,
  data,
  emptyMsg = "No data found.",
}) {
  const thStyle = {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "0.65rem",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    whiteSpace: "nowrap",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  };
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {data.length === 0 ? (
        <div
          style={{
            padding: "48px",
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "0.875rem",
          }}
        >
          {emptyMsg}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "500px",
            }}
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} style={thStyle}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, ri) => (
                <tr
                  key={ri}
                  style={{
                    borderTop: "1px solid #f3f4f6",
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "11px 14px",
                        fontSize: "0.8rem",
                        color: "#374151",
                        whiteSpace: col.wrap ? "normal" : "nowrap",
                      }}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
