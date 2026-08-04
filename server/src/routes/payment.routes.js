import { Router } from "express";
import express from "express";
import * as ctrl from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Paystack webhook
router.post(
  "/webhook/paystack",
  express.raw({ type: "application/json" }),
  ctrl.paystackWebhook,
);

// Payment routes
router.post("/initialize", authenticate, ctrl.initializePayment);
router.post("/demo", authenticate, ctrl.demoPayment);
router.get("/verify/:reference", authenticate, ctrl.verifyPayment);

export default router;