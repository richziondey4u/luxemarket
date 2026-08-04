import { Router } from "express";
import * as ctrl from "../controllers/product.controller.js";
import * as catCtrl from "../controllers/category.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/categories", catCtrl.getCategories);
router.get("/categories/:slug", catCtrl.getCategoryBySlug);
router.get("/", ctrl.getProducts);
router.get("/:id", ctrl.getProduct);
router.post("/:id/reviews", authenticate, ctrl.addReview);

export default router;
