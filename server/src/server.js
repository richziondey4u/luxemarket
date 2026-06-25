import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { config } from "./config/config.js";
import { prisma } from "./lib/prisma.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

/* ── Security ── */
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (Bruno, Postman, curl)
      if (!origin) return cb(null, true);
      const allowed = [
        config.frontendUrl,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4173",
      ];
      if (allowed.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

/* ── Rate limiting ── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts." },
});

app.use("/api/", limiter);
app.use("/api/auth/", authLimiter);

/* ── Body parsing — webhook needs raw body ── */
app.use(
  "/api/payment/webhook/paystack",
  express.raw({ type: "application/json" }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

if (config.nodeEnv !== "production") app.use(morgan("dev"));

/* ── Health ── */
app.get("/", (req, res) =>
  res.json({ success: true, message: "🚀 LuxeMarket API", version: "1.0.0" }),
);
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "API healthy",
      db: "connected",
      env: config.nodeEnv,
    });
  } catch {
    res.status(500).json({ success: false, message: "DB connection failed" });
  }
});

/* ── Routes ── */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

/* ── Errors ── */
app.use(notFound);
app.use(errorHandler);

/* ── Start ── */
const start = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
    app.listen(config.port, "0.0.0.0", () => {
      console.log(`🚀 LuxeMarket API → http://localhost:${config.port}`);
      console.log(`📋 Health check  → http://localhost:${config.port}/health`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
};

start();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
