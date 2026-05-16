import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { comment, laporanId } = req.body;
    const user = (req as any).user;

    const newComment = await prisma.comment.create({
      data: {
        comment,
        laporanId: Number(laporanId),
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      message: "Komentar berhasil ditambahkan",
      data: newComment,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      return res.status(404).json({ message: "Komentar tidak ditemukan" });
    }

    if (comment.userId !== user.id) {
      return res.status(403).json({ message: "Tidak punya akses untuk menghapus komentar ini" });
    }

    await prisma.comment.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Komentar berhasil dihapus" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
