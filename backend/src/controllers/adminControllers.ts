import { Request, Response } from "express";
import prisma from "../config/prisma";

// ✅ APPROVE laporan
export const approveLaporan = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const laporan = await prisma.laporan.update({
      where: { id },
      data: {
        status: "approved",
      },
    });

    res.json({
      message: "Laporan berhasil diapprove",
      data: laporan,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ❌ REJECT laporan
export const rejectLaporan = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const laporan = await prisma.laporan.update({
      where: { id },
      data: {
        status: "rejected",
      },
    });

    res.json({
      message: "Laporan berhasil direject",
      data: laporan,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const dashboardStats = async (
    req: Request,
    res: Response
  ) => {
    try {
      // total laporan
      const totalLaporan = await prisma.laporan.count();
  
      // laporan pending
      const pendingLaporan = await prisma.laporan.count({
        where: {
          status: "pending",
        },
      });
  
      // laporan approved
      const approvedLaporan = await prisma.laporan.count({
        where: {
          status: "approved",
        },
      });
  
      // laporan rejected
      const rejectedLaporan = await prisma.laporan.count({
        where: {
          status: "rejected",
        },
      });
  
      // total user
      const totalUser = await prisma.user.count();
  
      // total category
      const totalCategory = await prisma.category.count();
  
      res.json({
        totalLaporan,
        pendingLaporan,
        approvedLaporan,
        rejectedLaporan,
        totalUser,
        totalCategory,
      });
    } catch (error: any) {
      console.error(error);
  
      res.status(500).json({
        message: error.message,
      });
    }
  };