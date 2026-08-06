import argon2 from "argon2";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { config } from "../config/config.js";

const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    secure: config.nodeEnv === "production", // required when sameSite is "none"
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email, password required." });
    }

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });

    const hashed = await argon2.hash(password, { type: argon2.argon2id });

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

    const token = signToken(user.id, user.role);
    setCookie(res, token);

    res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}!`,
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    if (!user.isActive)
      return res
        .status(401)
        .json({ success: false, message: "Account deactivated." });
    if (user.role !== "USER") {
      return res
        .status(401)
        .json({ success: false, message: "Use admin login for this account." });
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    const token = signToken(user.id, user.role);
    setCookie(res, token);

    const { password: _, ...safe } = user;
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: { user: safe, token },
    });
  } catch (err) {
    next(err);
  }
};

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
      return res
        .status(400)
        .json({ success: false, message: "Name, email, password required." });
    }

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });

    const hashed = await argon2.hash(password, { type: argon2.argon2id });
    const validRoles = ["ADMIN", "MANAGER", "VIEWER"];
    const assignRole = validRoles.includes(role?.toUpperCase())
      ? role.toUpperCase()
      : "ADMIN";

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

    const token = signToken(user.id, user.role);
    setCookie(res, token);

    res.status(201).json({
      success: true,
      message: `Admin account created!`,
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user || !["ADMIN", "MANAGER", "VIEWER"].includes(user.role)) {
      return res
        .status(401)
        .json({ success: false, message: "No admin account found." });
    }
    if (!user.isActive)
      return res
        .status(401)
        .json({ success: false, message: "Account deactivated." });

    const valid = await argon2.verify(user.password, password);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    const token = signToken(user.id, user.role);
    setCookie(res, token);

    const { password: _, ...safe } = user;
    res.json({
      success: true,
      message: `Welcome, ${user.name}!`,
      data: { user: safe, token },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    path: "/",
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    secure: config.nodeEnv === "production",
  });
  res.json({ success: true, message: "Logged out." });
};

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
