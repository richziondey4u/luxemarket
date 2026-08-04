import { Router } from "express";
import * as ctrl from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.put("/profile", ctrl.updateProfile);
router.put("/address", ctrl.updateAddress);
router.put("/password", ctrl.changePassword);

router.get("/wishlist", ctrl.getWishlist);
router.post("/wishlist/:productId", ctrl.toggleWishlist);

router.get("/cart", ctrl.getCart);
router.post("/cart", ctrl.addToCart);
router.put("/cart/:productId", ctrl.updateCartItem);
router.delete("/cart/:productId", ctrl.removeFromCart);
router.delete("/cart", ctrl.clearCart);

export default router;
