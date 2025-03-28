import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getNotifications,
    markAllAsRead,
    deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/mark-read", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;
