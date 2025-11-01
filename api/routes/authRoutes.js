import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  resendOtp,
  verifyOtp,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, (req, res) => {
  res.send({ success: true, user: req.user });
});
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
