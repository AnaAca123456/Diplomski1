import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getMessagesWithUser, getConversations } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/conversations", protect, getConversations);
router.get("/:userId", protect, getMessagesWithUser); 


export default router;
