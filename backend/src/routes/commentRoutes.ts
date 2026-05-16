import express from "express";
import { createComment, deleteComment } from "../controllers/commentControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;
