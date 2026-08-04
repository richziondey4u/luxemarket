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
import paymentRoutes from "./routes/payment.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Bruno/Postman
      const allowed = [
        config.frontendUrl,
        "http://localhost:5173",
        "http://localhost:3000",
      ];
      if (allowed.includes(origin)) return cb(null, true);
      cb(new Error("CORS blocked"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const generalLimiter = rateLimit({
  windowMs: 60_000,
  max: 300,
  message: { success: false, message: "Too many requests." },
});
const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  message: { success: false, message: "Too many attempts, wait 1 minute." },
});

app.use("/api/", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/admin/login", authLimiter);
app.use("/api/auth/admin/register", authLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

if (config.nodeEnv !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRouter); // ← moved here, after body/cookie parsing

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await prisma.$connect();
  console.log("✅ Database connected");
  app.listen(config.port, "0.0.0.0", () =>
    console.log(`🚀 API → http://localhost:${config.port}`),
  );
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
