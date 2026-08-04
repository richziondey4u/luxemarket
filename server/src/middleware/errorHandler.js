export const errorHandler = (err, req, res, next) => {
  console.error("❌", err.message);

  if (err.code === "P2002")
    return res.status(409).json({ success: false, message: "Already exists." });
  if (err.code === "P2025")
    return res.status(404).json({ success: false, message: "Not found." });

  const status = err.status || 500;
  res
    .status(status)
    .json({ success: false, message: err.message || "Server error" });
};

export const notFound = (req, res) =>
  res
    .status(404)
    .json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
