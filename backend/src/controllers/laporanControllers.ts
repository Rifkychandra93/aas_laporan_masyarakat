import { Request, Response } from "express";
import prisma from "../config/prisma";
import fs from "fs";
import path from "path";

export const createLaporan = async (req: Request, res: Response) => {
  try {
    const { title, description, latitude, longitude, severity, categoryId } = req.body;
    const user = (req as any).user;

    const image = req.file ? req.file.filename : null;

    const laporan = await prisma.laporan.create({
      data: {
        title,
        description,
        latitude,
        longitude,
        severity,
        categoryId: Number(categoryId),
        image,
        userId: user.id,
      },
    });

    res.json({
      message: "Laporan berhasil dibuat",
      data: laporan,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllLaporan = async (req: Request, res: Response) => {
  try {
    const laporan = await prisma.laporan.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(laporan);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getLaporanById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const laporan = await prisma.laporan.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(laporan);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLaporan = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description, latitude, longitude, severity, categoryId } = req.body;
    const user = (req as any).user;

    const laporan = await prisma.laporan.findUnique({
      where: { id },
    });

    if (!laporan) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    if (laporan.userId !== user.id) {
      return res.status(403).json({ message: "Tidak punya akses" });
    }

    let image = laporan.image; 

    if (req.file) {
      if (laporan.image) {
        const oldPath = path.join(__dirname, "../../uploads", laporan.image);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      image = req.file.filename;
    }

    const updated = await prisma.laporan.update({
      where: { id },
      data: {
        title,
        description,
        latitude,
        longitude,
        severity,
        categoryId: Number(categoryId),
        image,
      },
    });

    res.json({
      message: "Laporan berhasil diupdate",
      data: updated,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteLaporan = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = (req as any).user;

    const laporan = await prisma.laporan.findUnique({
      where: { id },
    });

    if (!laporan) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    if (laporan.userId !== user.id) {
      return res.status(403).json({ message: "Tidak punya akses" });
    }

    await prisma.laporan.delete({
      where: { id },
    });

    res.json({
      message: "Laporan berhasil dihapus",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};