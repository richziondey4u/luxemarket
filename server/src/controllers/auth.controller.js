import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { config } from "../config/config.js";

/* ── Token helpers ── */
const signAccess = (userId, role) =>
  jwt.sign({ userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

const signRefresh = (userId) =>
  jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

const setCookies = (res, access, refresh) => {
  const base = { httpOnly: true, sameSite: "lax", path: "/" };
  const secure = config.nodeEnv === "production";
  res.cookie("accessToken", access, {
    ...base,
    secure,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refresh, {
    ...base,
    secure,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const saveRefresh = (userId, token) =>
  prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

/* ── Register customer ── */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const hashed = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
    });

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        phone: phone || null,
        role: "USER",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f7d52&textColor=ffffff`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    const access = signAccess(user.id, user.role);
    const refresh = signRefresh(user.id);
    await saveRefresh(user.id, refresh);
    setCookies(res, access, refresh);

    res.status(201).json({
      success: true,
      message: `Welcome to LuxeMarket, ${user.name}! 🎉`,
      data: { user, accessToken: access },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Login customer ── */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated. Contact support.",
      });
    }
    if (["ADMIN", "MANAGER", "VIEWER"].includes(user.role)) {
      return res.status(401).json({
        success: false,
        message: "Please use the admin portal to sign in.",
      });
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const access = signAccess(user.id, user.role);
    const refresh = signRefresh(user.id);
    await saveRefresh(user.id, refresh);
    setCookies(res, access, refresh);

    const { password: _, ...safe } = user;
    res.json({
      success: true,
      message: `Welcome back, ${user.name}! 👋`,
      data: { user: safe, accessToken: access },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Admin Register — saves to DB with invite code ── */
export const adminRegister = async (req, res, next) => {
  try {
    const { name, email, password, role, inviteCode } = req.body;

    if (
      !inviteCode ||
      inviteCode.trim().toUpperCase() !== config.adminInviteCode.toUpperCase()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid authorization code." });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const hashed = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
    });

    const validRoles = ["ADMIN", "MANAGER", "VIEWER"];
    const assignRole = validRoles.includes(role?.toUpperCase())
      ? role.toUpperCase()
      : "ADMIN";

    // ── Saved to PostgreSQL database ──
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        role: assignRole,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f7d52&textColor=ffffff`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    const access = signAccess(user.id, user.role);
    const refresh = signRefresh(user.id);
    await saveRefresh(user.id, refresh);
    setCookies(res, access, refresh);

    console.log(
      `✅ Admin registered: ${user.email} (${user.role}) — ID: ${user.id}`,
    );

    res.status(201).json({
      success: true,
      message: `Admin account created! Welcome, ${user.name}.`,
      data: { user, accessToken: access },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Admin Login — checks DB ── */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !["ADMIN", "MANAGER", "VIEWER"].includes(user.role)) {
      return res.status(401).json({
        success: false,
        message: "No admin account found with this email.",
      });
    }
    if (!user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Account deactivated." });
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const access = signAccess(user.id, user.role);
    const refresh = signRefresh(user.id);
    await saveRefresh(user.id, refresh);
    setCookies(res, access, refresh);

    const { password: _, ...safe } = user;
    console.log(`✅ Admin login: ${user.email} (${user.role})`);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: { user: safe, accessToken: access },
    });
  } catch (err) {
    next(err);
  }
};

/* ── Refresh token ── */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No refresh token." });

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.refreshSecret);
    } catch {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token." });
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired. Please log in again.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }

    // Rotate
    await prisma.refreshToken.delete({ where: { token } });
    const newAccess = signAccess(user.id, user.role);
    const newRefresh = signRefresh(user.id);
    await saveRefresh(user.id, newRefresh);
    setCookies(res, newAccess, newRefresh);

    res.json({ success: true, data: { accessToken: newAccess } });
  } catch (err) {
    next(err);
  }
};

/* ── Logout ── */
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token)
      await prisma.refreshToken
        .deleteMany({ where: { token } })
        .catch(() => {});
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    res.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
};

/* ── Get current user ── */
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        address: true,
      },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};
