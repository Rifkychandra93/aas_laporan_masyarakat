import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { dashboardStats } from "../controllers/adminControllers";
import { approveLaporan, rejectLaporan } from "../controllers/adminControllers";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      message: "Selamat datang admin ",
    });
  }
);

router.put(
    "/laporan/:id/approve",
    authMiddleware,
    adminMiddleware,
    approveLaporan
  );
  
  router.put(
    "/laporan/:id/reject",
    authMiddleware,
    adminMiddleware,
    rejectLaporan
  );

  router.get(
    "/dashboard/stats",
    authMiddleware,
    adminMiddleware,
    dashboardStats
  );

export default router;