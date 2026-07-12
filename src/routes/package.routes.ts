import { Router } from "express";
import {
  getPackages,
  getFeaturedPackages,
  getMyPackages,
  getPackageById,
  createPackage,
  deletePackage,
  addReview,
} from "../controllers/package.controller";
import { verifyToken } from "../middleware/auth";

const router = Router();

// IMPORTANT: specific routes must come before /:id to avoid Express matching them as an id param
router.get("/featured", getFeaturedPackages);
router.get("/manage/my", verifyToken, getMyPackages);

router.get("/", getPackages);
router.post("/", verifyToken, createPackage);

router.get("/:id", getPackageById);
router.delete("/:id", verifyToken, deletePackage);
router.post("/:id/reviews", verifyToken, addReview);

export default router;
