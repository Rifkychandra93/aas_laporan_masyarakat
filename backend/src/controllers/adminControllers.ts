import { Request, Response } from "express";
import prisma from "../config/prisma";

export const approveLaporan = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const laporan = await prisma.laporan.update({
      where: { id },
      data: {
        status: "approved",
      },
    });

    await prisma.notification.create({
      data: {
        userId: laporan.userId,
        title: "Laporan Disetujui!",
        message: `Laporan Anda yang berjudul "${laporan.title}" telah disetujui oleh admin. Terima kasih atas partisipasi Anda!`,
        type: "report_status",
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

export const rejectLaporan = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const laporan = await prisma.laporan.update({
      where: { id },
      data: {
        status: "rejected",
      },
    });

    await prisma.notification.create({
      data: {
        userId: laporan.userId,
        title: "Laporan Ditolak ✕",
        message: `Laporan Anda yang berjudul "${laporan.title}" ditolak oleh admin karena belum memenuhi kriteria kelayakan.`,
        type: "report_status",
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
      const totalLaporan = await prisma.laporan.count();
  
      const pendingLaporan = await prisma.laporan.count({
        where: {
          status: "pending",
        },
      });
  
      const approvedLaporan = await prisma.laporan.count({
        where: {
          status: "approved",
        },
      });
  
      const rejectedLaporan = await prisma.laporan.count({
        where: {
          status: "rejected",
        },
      });
  
      const totalUser = await prisma.user.count({
        where: {
          isBanned: false,
        },
      });
  
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isBanned: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true,
        createdAt: true,
        _count: {
          select: {
            laporan: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteLaporanAdmin = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const laporan = await prisma.laporan.findUnique({
      where: { id },
    });

    if (!laporan) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    await prisma.laporan.delete({
      where: { id },
    });

    await prisma.notification.create({
      data: {
        userId: laporan.userId,
        title: "Laporan Dihapus Admin ✕",
        message: `Laporan Anda yang berjudul "${laporan.title}" telah dihapus oleh admin karena tidak sesuai dengan pedoman komunitas.`,
        type: "report_status",
      },
    });

    res.json({
      message: "Laporan berhasil dihapus oleh admin",
    });
  } catch (error: any) {
    console.error("Gagal menghapus laporan:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    await prisma.user.update({
      where: { id },
      data: { isBanned: true },
    });

    res.json({ message: "Pengguna berhasil dihapus/dibanned" });
  } catch (error: any) {
    console.error("Gagal menghapus pengguna:", error);
    res.status(500).json({ message: error.message });
  }
};