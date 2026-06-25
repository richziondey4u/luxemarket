import { Router } from "express";
import * as ctrl from "../controllers/admin.controller.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);
router.use(requireRole("ADMIN", "MANAGER", "VIEWER"));

router.get("/dashboard", ctrl.getDashboardStats);
router.get("/analytics", ctrl.getAnalytics);

// Orders
router.get(
  "/orders",
  requireRole("ADMIN", "MANAGER", "VIEWER"),
  ctrl.getAllOrders,
);
router.put(
  "/orders/:id/status",
  requireRole("ADMIN", "MANAGER"),
  ctrl.updateOrderStatus,
);

// Users
router.get("/users", requireRole("ADMIN"), ctrl.getAllUsers);
router.put(
  "/users/:id/toggle-active",
  requireRole("ADMIN"),
  ctrl.toggleUserActive,
);

// Products — CRUD all saved to DB
router.get(
  "/products",
  requireRole("ADMIN", "MANAGER", "VIEWER"),
  ctrl.getAdminProducts,
);
router.post("/products", requireRole("ADMIN", "MANAGER"), ctrl.createProduct);
router.put(
  "/products/:id",
  requireRole("ADMIN", "MANAGER"),
  ctrl.updateProduct,
);
router.delete("/products/:id", requireRole("ADMIN"), ctrl.deleteProduct);

// Categories
router.post("/categories", requireRole("ADMIN"), ctrl.createCategory);

export default router;
