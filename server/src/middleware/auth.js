import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { prisma } from "../lib/prisma.js";

export const authenticate = async (req, res, next) => {
  try {
    console.log("========== AUTH ==========");
    console.log("Origin:", req.headers.origin);
    console.log("Cookie Header:", req.headers.cookie);
    console.log("Cookies:", req.cookies);
    console.log("Authorization:", req.headers.authorization);

    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatar: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient permissions." });
    }
    next();
  };
