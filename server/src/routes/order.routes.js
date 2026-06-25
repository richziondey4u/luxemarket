import { Router } from "express";
import * as ctrl from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.post("/", ctrl.createOrder);
router.get("/", ctrl.getUserOrders);
router.get("/:id", ctrl.getOrder);
router.put("/:id/cancel", ctrl.cancelOrder);

export default router;
