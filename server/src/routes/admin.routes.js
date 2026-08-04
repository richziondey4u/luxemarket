import { Router } from "express";
import {
  getDashboardStats,
  getAnalytics,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserActive,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteOrder,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/admin.controller.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.use(requireRole("ADMIN", "MANAGER", "VIEWER"));

router.get("/dashboard", getDashboardStats);
router.get("/analytics", getAnalytics);

router.get("/orders", getAllOrders);
router.put(
  "/orders/:id/status",
  requireRole("ADMIN", "MANAGER"),
  updateOrderStatus,
);

router.delete(
  "/orders/:id",
  requireRole("ADMIN"),
  deleteOrder
);

router.get("/users", requireRole("ADMIN"), getAllUsers);
router.put("/users/:id/toggle-active", requireRole("ADMIN"), toggleUserActive);
router.get("/products", getAdminProducts);
router.post("/products", requireRole("ADMIN", "MANAGER"), createProduct);
router.put("/products/:id", requireRole("ADMIN", "MANAGER"), updateProduct);
router.delete("/products/:id", requireRole("ADMIN"), deleteProduct);

router.get("/categories", getAdminCategories);
router.post("/categories", requireRole("ADMIN"), createCategory);
router.put("/categories/:id", requireRole("ADMIN"), updateCategory);
router.delete("/categories/:id", requireRole("ADMIN"), deleteCategory);

export default router;
