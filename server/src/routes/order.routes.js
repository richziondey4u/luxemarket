import { Router } from "express";
import * as ctrl from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public route - must be defined BEFORE router.use(authenticate),
// since guests without an account need to track orders by order number.
router.get("/track/:orderNumber", ctrl.trackOrder);

// Everything below this line requires a logged-in user
router.use(authenticate);

router.post("/", ctrl.createOrder);
router.get("/", ctrl.getUserOrders);
router.get("/:id", ctrl.getOrder);
router.put("/:id/cancel", ctrl.cancelOrder);

export default router;