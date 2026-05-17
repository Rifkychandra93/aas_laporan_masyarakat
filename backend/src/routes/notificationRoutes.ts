import express from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead
} from "../controllers/notificationControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// All routes here are authenticated
router.get("/", authMiddleware, getUserNotifications);
router.put("/read-all", authMiddleware, markAllAsRead);
router.put("/:id/read", authMiddleware, markAsRead);

export default router;
