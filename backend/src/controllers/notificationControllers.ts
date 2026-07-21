import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(notifications);
  } catch (error: any) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).user.id;

    const notification = await prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });

    res.json({
      message: "Notifikasi ditandai telah dibaca",
      data: notification,
    });
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.json({
      message: "Semua notifikasi telah dibaca",
    });
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: error.message });
  }
};
