import { Router } from "express";
import * as ctrl from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", ctrl.getProducts);
router.get("/categories", ctrl.getCategories);
router.get("/:id", ctrl.getProduct);
router.post("/:id/reviews", authenticate, ctrl.addReview);

export default router;
