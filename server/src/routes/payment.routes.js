import { Router } from "express";
import * as ctrl from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/auth.js";
import express from "express";

const router = Router();

// Webhook needs raw body — must be before json middleware
router.post(
  "/webhook/paystack",
  express.raw({ type: "application/json" }),
  ctrl.paystackWebhook,
);

router.post("/initialize", authenticate, ctrl.initializePayment);
router.get("/verify/:reference", authenticate, ctrl.verifyPayment);

export default router;
