import express from "express";
import multer from "multer";
import path from "path";
import {
    getUserById,
    getAllUsers,
    updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.put("/update", protect, upload.single("photo"), updateUserProfile);

router.get("/:id", protect, getUserById);

router.get("/", protect, getAllUsers);



export default router;
