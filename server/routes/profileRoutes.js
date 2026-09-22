import express from "express";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import profileController from "../controllers/profileController.js";

const router = express.Router();

// Multer config — temp storage
const upload = multer({ dest: "uploads/" });

router.get("/followers", protect.forUser, profileController.getMyFollowers);
router.get("/followings", protect.forUser, profileController.getMyFollowings);
router.get("/me", protect.forUser, profileController.getMyProfile);
router.put("/update", protect.forUser, upload.single("avatar"), profileController.updateProfile);

export default router;