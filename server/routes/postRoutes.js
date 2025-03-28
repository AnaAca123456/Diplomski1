import express from "express";
import multer from "multer";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    markLegal,
    markIllegal,
    addComment,
    ratePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
        cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({ storage });
router.use((req, res, next) => {
    console.log("📥 POSTS ROUTE HIT:", req.method, req.originalUrl);
    next();
});

router.post("/", protect, allowRoles("korisnik"), upload.single("businessPlanFile"), createPost);
router.get("/", protect, getAllPosts);
router.get("/:id", protect, getPostById);
router.put("/:id", protect, upload.single("businessPlanFile"), updatePost);
router.delete("/:id", protect, allowRoles("korisnik", "admin"), deletePost);
router.post("/:id/rate", protect, allowRoles("mentor"), ratePost);

router.post("/:id/like", protect, allowRoles("korisnik", "mentor"), likePost);
router.post("/:id/legal", protect, allowRoles("advokat"), markLegal);
router.post("/:id/illegal", protect, allowRoles("advokat"), markIllegal);
router.post("/:id/comments", protect, allowRoles("korisnik", "mentor", "advokat"), addComment);

export default router;
