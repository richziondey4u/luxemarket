export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // Prisma errors
  if (err.code === "P2002") {
    return res
      .status(409)
      .json({
        success: false,
        message: "A record with this value already exists.",
      });
  }
  if (err.code === "P2025") {
    return res
      .status(404)
      .json({ success: false, message: "Record not found." });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired." });
  }

  // Validation errors
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid JSON body." });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
};
