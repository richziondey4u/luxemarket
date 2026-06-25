import { Router } from "express";
import * as ctrl from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.put("/profile", ctrl.updateProfile);
router.put("/address", ctrl.updateAddress);
router.put("/password", ctrl.changePassword);

// Wishlist
router.get("/wishlist", ctrl.getWishlist);
router.post("/wishlist/:productId", ctrl.toggleWishlist);
router.delete("/wishlist/:productId", ctrl.toggleWishlist);

// Cart
router.get("/cart", ctrl.getCart);
router.post("/cart", ctrl.addToCart);
router.put("/cart/:productId", ctrl.updateCartItem);
router.delete("/cart/:productId", ctrl.removeFromCart);
router.delete("/cart", ctrl.clearCart);

export default router;
