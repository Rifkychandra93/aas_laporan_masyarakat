import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. ambil token dari header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak ada" });
    }

    // format: Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    // 2. verifikasi token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // 3. simpan data user ke request
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};