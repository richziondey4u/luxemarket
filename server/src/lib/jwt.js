import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const signToken = (userId, role) =>
  jwt.sign(
    { userId, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

export const verifyToken = (token) =>
  jwt.verify(token, config.jwt.secret);