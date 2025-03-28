import express from "express";
import { toggleLike, getLikesForPost } from "../controllers/likeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:postId/like", protect, allowRoles("korisnik", "mentor"), toggleLike);

router.get("/:postId", protect, getLikesForPost);

export default router;
