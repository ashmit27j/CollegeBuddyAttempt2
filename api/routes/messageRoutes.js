import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.js";
import {
  getConversation,
  sendMessage,
  deleteMessage,
  getUnreadCounts,
  markConversationRead,
} from "../controllers/messageController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protectRoute);

router.post("/send", upload.single("file"), sendMessage);
router.get("/conversation/:userId", getConversation);
router.delete("/delete/:messageId", deleteMessage);
router.get("/unread-count", getUnreadCounts);
router.post("/read/:userId", markConversationRead);

export default router;
