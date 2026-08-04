import { Router } from "express";
import * as ctrl from "../controllers/chat.controller.js";
import { optionalAuth } from "../middleware/optionalAuth.js";




const router = Router();


// Chat works for both guests and logged-in users - auth is optional here.
// If a valid session cookie exists, req.user gets populated so the bot
// can answer "what did I order" / "what's in my cart" questions.

router.post("/", optionalAuth, ctrl.chat);

export default router;