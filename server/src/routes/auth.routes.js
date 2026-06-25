import { Router } from "express";
import { body } from "express-validator";
import * as ctrl from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  ctrl.register,
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  validateRequest,
  ctrl.login,
);

router.post(
  "/admin/register",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("inviteCode").notEmpty().withMessage("Authorization code required"),
  ],
  validateRequest,
  ctrl.adminRegister,
);

router.post(
  "/admin/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validateRequest,
  ctrl.adminLogin,
);

router.post("/refresh", ctrl.refreshToken);
router.post("/logout", authenticate, ctrl.logout);
router.get("/me", authenticate, ctrl.getMe);

export default router;
