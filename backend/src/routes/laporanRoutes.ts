import express from "express";
import {
  createLaporan,
  getAllLaporan,
  getLaporanById,
  updateLaporan,
  deleteLaporan,
} from "../controllers/laporanControllers";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createLaporan);
router.get("/", authMiddleware, getAllLaporan);
router.get("/:id", authMiddleware, getLaporanById);
router.put("/:id", authMiddleware, upload.single("image"), updateLaporan);
router.delete("/:id", authMiddleware, deleteLaporan);

export default router;