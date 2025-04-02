import express from "express";
import {
    getAllUsers,
    deleteUser,
    getAllPosts,
    deletePost,
    updateUser,
    updatePost,
    getAllComments,
    deleteCommentById,
    updateAnyComment
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

router.get("/posts", getAllPosts);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id", updatePost);

router.get("/comments", protect, allowRoles("admin"), getAllComments);
router.delete("/comments/:id", protect, allowRoles("admin"), deleteCommentById);
router.put("/comments/:id", updateAnyComment);



export default router;
