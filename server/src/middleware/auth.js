import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { prisma } from "../lib/prisma.js";

export const authenticate = async (req, res, next) => {
  try {
    // 1. Try Authorization header first, then cookie
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // 3. Check user still exists and is active
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
      return res
        .status(401)
        .json({ success: false, message: "User not found or deactivated." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Token expired.",
          code: "TOKEN_EXPIRED",
        });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
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
