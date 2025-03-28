import express from "express";
import {
    addComment,
    deleteComment,
    getCommentsForPost,
} from "../controllers/commentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:postId/comments", protect, allowRoles("korisnik", "mentor", "advokat"), addComment);
router.get("/:postId", protect, getCommentsForPost);
router.delete("/:commentId", protect, deleteComment); 

export default router;
