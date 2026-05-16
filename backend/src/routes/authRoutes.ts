import express from "express";
import { login, register, getMe, updateProfile } from "../controllers/authControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateProfile);

export default router;