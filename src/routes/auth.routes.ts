import { Router } from "express";
import {
  register,
  login,
  googleAuth,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", verifyToken, getMe);
router.put("/profile", verifyToken, updateProfile);
router.put("/password", verifyToken, changePassword);

export default router;
