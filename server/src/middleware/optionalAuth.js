import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { prisma } from "../lib/prisma.js";

export async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) return next();

    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (user) req.user = user;
  } catch {
    // Ignore invalid token
  }

  next();
}